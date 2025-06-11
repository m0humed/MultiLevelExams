// Enhanced types for comprehensive assessment system

export interface QuestionOption {
  id: string;
  text: string;
  letter: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  misconception?: string; // Common misconception for incorrect options
}

export interface EnhancedQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string; // Detailed explanation for correct answer
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
}

export interface StudentAnswer {
  id: string;
  studentId: string;
  examId: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  timestamp: Date;
  scoreReceived: number;
  revisionHistory?: {
    previousAnswer: string;
    changedAt: Date;
    timeSpent: number;
  }[];
}

export interface ExamSession {
  id: string;
  studentId: string;
  examId: string;
  startTime: Date;
  endTime?: Date;
  totalTimeSpent: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  answers: StudentAnswer[];
}

export interface PerformanceMetrics {
  studentId: string;
  examId: string;
  totalScore: number;
  percentage: number;
  timeSpent: number;
  questionsCorrect: number;
  totalQuestions: number;
  categoryPerformance: {
    [category: string]: {
      correct: number;
      total: number;
      percentage: number;
    };
  };
  difficultyPerformance: {
    easy: { correct: number; total: number };
    medium: { correct: number; total: number };
    hard: { correct: number; total: number };
  };
}

export interface Student {
  id: string;
  name: string;
  email: string;
  studentNumber: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive';
  metadata?: {
    grade?: string;
    section?: string;
    [key: string]: any;
  };
}

export interface EnhancedExam {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  totalQuestions: number;
  passingScore: number;
  timeLimit: number; // in minutes
  maxAttempts: number;
  isPublished: boolean;
  questions: EnhancedQuestion[];
  settings: {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    showResults: boolean;
    allowReview: boolean;
    preventCheating: boolean;
  };
}