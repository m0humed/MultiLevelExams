// Utility functions for assessment system

import { EnhancedQuestion, StudentAnswer, PerformanceMetrics } from '../types/assessment';

export const calculatePerformanceMetrics = (
  studentId: string,
  examId: string,
  questions: EnhancedQuestion[],
  answers: StudentAnswer[]
): PerformanceMetrics => {
  const totalQuestions = questions.length;
  const totalPossiblePoints = questions.reduce((sum, q) => sum + q.points, 0);
  
  let totalScore = 0;
  let questionsCorrect = 0;
  let totalTimeSpent = 0;
  
  const categoryPerformance: { [category: string]: { correct: number; total: number; percentage: number } } = {};
  const difficultyPerformance = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 }
  };

  questions.forEach(question => {
    const answer = answers.find(a => a.questionId === question.id);
    
    if (answer) {
      totalTimeSpent += answer.timeSpent;
      
      if (answer.isCorrect) {
        totalScore += question.points;
        questionsCorrect++;
      }
      
      // Category performance
      if (!categoryPerformance[question.category]) {
        categoryPerformance[question.category] = { correct: 0, total: 0, percentage: 0 };
      }
      categoryPerformance[question.category].total++;
      if (answer.isCorrect) {
        categoryPerformance[question.category].correct++;
      }
      
      // Difficulty performance
      difficultyPerformance[question.difficulty].total++;
      if (answer.isCorrect) {
        difficultyPerformance[question.difficulty].correct++;
      }
    }
  });

  // Calculate category percentages
  Object.keys(categoryPerformance).forEach(category => {
    const perf = categoryPerformance[category];
    perf.percentage = perf.total > 0 ? (perf.correct / perf.total) * 100 : 0;
  });

  const percentage = totalPossiblePoints > 0 ? (totalScore / totalPossiblePoints) * 100 : 0;

  return {
    studentId,
    examId,
    totalScore,
    percentage,
    timeSpent: totalTimeSpent,
    questionsCorrect,
    totalQuestions,
    categoryPerformance,
    difficultyPerformance
  };
};

export const generateDetailedFeedback = (
  question: EnhancedQuestion,
  studentAnswer: StudentAnswer
): string => {
  if (studentAnswer.isCorrect) {
    return `Excellent! You correctly identified that "${question.correctAnswer}" is the right answer. ${question.explanation}`;
  }

  const selectedOption = question.options.find(opt => opt.text === studentAnswer.selectedAnswer);
  let feedback = `The correct answer is "${question.correctAnswer}". `;
  
  if (selectedOption?.misconception) {
    feedback += `You selected "${studentAnswer.selectedAnswer}". ${selectedOption.misconception} `;
  }
  
  feedback += question.explanation;
  
  return feedback;
};

export const identifyWeakAreas = (performanceMetrics: PerformanceMetrics): string[] => {
  const weakAreas: string[] = [];
  
  // Check category performance
  Object.entries(performanceMetrics.categoryPerformance).forEach(([category, performance]) => {
    if (performance.percentage < 60) {
      weakAreas.push(`${category} (${performance.percentage.toFixed(1)}% correct)`);
    }
  });
  
  // Check difficulty performance
  Object.entries(performanceMetrics.difficultyPerformance).forEach(([difficulty, performance]) => {
    if (performance.total > 0) {
      const percentage = (performance.correct / performance.total) * 100;
      if (percentage < 50) {
        weakAreas.push(`${difficulty} difficulty questions (${percentage.toFixed(1)}% correct)`);
      }
    }
  });
  
  return weakAreas;
};

export const generateStudyRecommendations = (
  performanceMetrics: PerformanceMetrics,
  questions: EnhancedQuestion[]
): string[] => {
  const recommendations: string[] = [];
  const weakAreas = identifyWeakAreas(performanceMetrics);
  
  if (weakAreas.length > 0) {
    recommendations.push("Focus on improving in these areas:");
    recommendations.push(...weakAreas.map(area => `• Review ${area}`));
  }
  
  // Time-based recommendations
  const avgTimePerQuestion = performanceMetrics.timeSpent / performanceMetrics.totalQuestions;
  if (avgTimePerQuestion > 120) { // More than 2 minutes per question
    recommendations.push("• Practice time management - try to answer questions more quickly");
  } else if (avgTimePerQuestion < 30) { // Less than 30 seconds per question
    recommendations.push("• Take more time to carefully read and analyze each question");
  }
  
  // Score-based recommendations
  if (performanceMetrics.percentage < 70) {
    recommendations.push("• Review the fundamental concepts covered in this assessment");
    recommendations.push("• Consider additional practice exercises");
  } else if (performanceMetrics.percentage >= 90) {
    recommendations.push("• Excellent performance! Consider advancing to more challenging topics");
  }
  
  return recommendations;
};

export const exportPerformanceReport = (
  studentName: string,
  examName: string,
  performanceMetrics: PerformanceMetrics,
  questions: EnhancedQuestion[],
  answers: StudentAnswer[]
): string => {
  const report = `
PERFORMANCE REPORT
==================

Student: ${studentName}
Exam: ${examName}
Date: ${new Date().toLocaleDateString()}

OVERALL PERFORMANCE
-------------------
Score: ${performanceMetrics.percentage.toFixed(1)}% (${performanceMetrics.totalScore} points)
Correct Answers: ${performanceMetrics.questionsCorrect} / ${performanceMetrics.totalQuestions}
Time Spent: ${Math.floor(performanceMetrics.timeSpent / 60)}:${(performanceMetrics.timeSpent % 60).toString().padStart(2, '0')}

CATEGORY BREAKDOWN
------------------
${Object.entries(performanceMetrics.categoryPerformance)
  .map(([category, perf]) => `${category}: ${perf.percentage.toFixed(1)}% (${perf.correct}/${perf.total})`)
  .join('\n')}

DIFFICULTY BREAKDOWN
--------------------
${Object.entries(performanceMetrics.difficultyPerformance)
  .map(([difficulty, perf]) => {
    const percentage = perf.total > 0 ? (perf.correct / perf.total) * 100 : 0;
    return `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}: ${percentage.toFixed(1)}% (${perf.correct}/${perf.total})`;
  })
  .join('\n')}

RECOMMENDATIONS
---------------
${generateStudyRecommendations(performanceMetrics, questions).join('\n')}
`;

  return report;
};