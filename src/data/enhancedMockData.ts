// Enhanced mock data with detailed questions, explanations, and misconceptions

import { EnhancedQuestion, EnhancedExam, Student, StudentAnswer, PerformanceMetrics } from '../types/assessment';

export const enhancedMockQuestions: EnhancedQuestion[] = [
  {
    id: 'q1',
    text: 'What is the primary purpose of the HTML <head> element?',
    type: 'multiple-choice',
    options: [
      {
        id: 'q1-a',
        text: 'To display the main content of the webpage',
        letter: 'A',
        isCorrect: false,
        misconception: 'The <head> element is not visible to users. The <body> element contains the visible content.'
      },
      {
        id: 'q1-b',
        text: 'To contain metadata and resources for the document',
        letter: 'B',
        isCorrect: true
      },
      {
        id: 'q1-c',
        text: 'To create the navigation menu',
        letter: 'C',
        isCorrect: false,
        misconception: 'Navigation menus are typically created within the <body> using elements like <nav>, <ul>, and <li>.'
      },
      {
        id: 'q1-d',
        text: 'To style the webpage appearance',
        letter: 'D',
        isCorrect: false,
        misconception: 'While CSS can be included in the <head>, styling is primarily done through CSS, not the <head> element itself.'
      }
    ],
    correctAnswer: 'To contain metadata and resources for the document',
    explanation: 'The <head> element contains metadata about the HTML document that is not displayed on the page. This includes the document title, character encoding, viewport settings, links to stylesheets, scripts, and other meta information that browsers and search engines use to understand and process the document.',
    points: 5,
    difficulty: 'easy',
    category: 'HTML Fundamentals',
    tags: ['html', 'structure', 'metadata']
  },
  {
    id: 'q2',
    text: 'Which CSS property is used to control the space between the content and the border of an element?',
    type: 'multiple-choice',
    options: [
      {
        id: 'q2-a',
        text: 'margin',
        letter: 'A',
        isCorrect: false,
        misconception: 'Margin controls the space outside the border, between the element and other elements.'
      },
      {
        id: 'q2-b',
        text: 'padding',
        letter: 'B',
        isCorrect: true
      },
      {
        id: 'q2-c',
        text: 'border-spacing',
        letter: 'C',
        isCorrect: false,
        misconception: 'Border-spacing is specifically for table elements to control space between table cells.'
      },
      {
        id: 'q2-d',
        text: 'gap',
        letter: 'D',
        isCorrect: false,
        misconception: 'Gap is used in CSS Grid and Flexbox to control space between grid items or flex items, not between content and border.'
      }
    ],
    correctAnswer: 'padding',
    explanation: 'Padding is the CSS property that controls the space between an element\'s content and its border. It creates internal spacing within the element. This is different from margin, which creates space outside the border between elements.',
    points: 5,
    difficulty: 'medium',
    category: 'CSS Fundamentals',
    tags: ['css', 'box-model', 'spacing']
  },
  {
    id: 'q3',
    text: 'What will be the output of the following JavaScript code?\n\nconsole.log(typeof null);',
    type: 'multiple-choice',
    options: [
      {
        id: 'q3-a',
        text: '"null"',
        letter: 'A',
        isCorrect: false,
        misconception: 'This would be the result if null were converted to a string, but typeof returns the type, not the value.'
      },
      {
        id: 'q3-b',
        text: '"undefined"',
        letter: 'B',
        isCorrect: false,
        misconception: 'undefined and null are different values. typeof undefined returns "undefined", but null has a different behavior.'
      },
      {
        id: 'q3-c',
        text: '"object"',
        letter: 'C',
        isCorrect: true
      },
      {
        id: 'q3-d',
        text: '"boolean"',
        letter: 'D',
        isCorrect: false,
        misconception: 'null is not a boolean value. Boolean values are true and false.'
      }
    ],
    correctAnswer: '"object"',
    explanation: 'This is a well-known quirk in JavaScript. The typeof operator returns "object" for null, even though null is not actually an object. This is considered a bug in the language that has been preserved for backward compatibility. In reality, null represents the intentional absence of any object value.',
    points: 10,
    difficulty: 'hard',
    category: 'JavaScript Fundamentals',
    tags: ['javascript', 'types', 'quirks']
  }
];

export const enhancedMockExam: EnhancedExam = {
  id: 'exam-1',
  name: 'Web Development Fundamentals Assessment',
  description: 'Comprehensive assessment covering HTML, CSS, and JavaScript fundamentals',
  createdBy: 'instructor-1',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  totalQuestions: 3,
  passingScore: 70,
  timeLimit: 45,
  maxAttempts: 3,
  isPublished: true,
  questions: enhancedMockQuestions,
  settings: {
    shuffleQuestions: true,
    shuffleOptions: true,
    showResults: true,
    allowReview: true,
    preventCheating: false
  }
};

export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    studentNumber: 'STU001',
    enrollmentDate: new Date('2024-01-10'),
    status: 'active',
    metadata: {
      grade: '12',
      section: 'A'
    }
  },
  {
    id: 'student-2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    studentNumber: 'STU002',
    enrollmentDate: new Date('2024-01-10'),
    status: 'active',
    metadata: {
      grade: '12',
      section: 'B'
    }
  }
];

export const mockStudentAnswers: StudentAnswer[] = [
  {
    id: 'answer-1',
    studentId: 'student-1',
    examId: 'exam-1',
    questionId: 'q1',
    selectedAnswer: 'To contain metadata and resources for the document',
    isCorrect: true,
    timeSpent: 45,
    timestamp: new Date('2024-01-25T10:15:00'),
    scoreReceived: 5
  },
  {
    id: 'answer-2',
    studentId: 'student-1',
    examId: 'exam-1',
    questionId: 'q2',
    selectedAnswer: 'margin',
    isCorrect: false,
    timeSpent: 60,
    timestamp: new Date('2024-01-25T10:16:00'),
    scoreReceived: 0,
    revisionHistory: [
      {
        previousAnswer: 'gap',
        changedAt: new Date('2024-01-25T10:15:30'),
        timeSpent: 30
      }
    ]
  },
  {
    id: 'answer-3',
    studentId: 'student-1',
    examId: 'exam-1',
    questionId: 'q3',
    selectedAnswer: '"object"',
    isCorrect: true,
    timeSpent: 90,
    timestamp: new Date('2024-01-25T10:17:30'),
    scoreReceived: 10
  }
];

export const mockPerformanceMetrics: PerformanceMetrics = {
  studentId: 'student-1',
  examId: 'exam-1',
  totalScore: 15,
  percentage: 75,
  timeSpent: 195, // 3 minutes 15 seconds
  questionsCorrect: 2,
  totalQuestions: 3,
  categoryPerformance: {
    'HTML Fundamentals': {
      correct: 1,
      total: 1,
      percentage: 100
    },
    'CSS Fundamentals': {
      correct: 0,
      total: 1,
      percentage: 0
    },
    'JavaScript Fundamentals': {
      correct: 1,
      total: 1,
      percentage: 100
    }
  },
  difficultyPerformance: {
    easy: { correct: 1, total: 1 },
    medium: { correct: 0, total: 1 },
    hard: { correct: 1, total: 1 }
  }
};