// Mock data for the exam system

import { User, UserRole } from '../context/AuthContext';

// Types
export interface ExamStage {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  duration: number; // in minutes
  passingScore: number; // percentage required to pass
  order: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  createdBy: string; // instructor ID
  createdAt: string;
  stages: ExamStage[];
  isPublished: boolean;
}

export interface StudentProgress {
  studentId: string;
  examId: string;
  stageId: string;
  completed: boolean;
  score: number;
  passed: boolean;
  startedAt: string;
  completedAt?: string;
}

// Mock data
export const mockInstructors: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'instructor@example.com',
    role: 'instructor' as UserRole,
  },
];

export const mockStudents: User[] = [
  {
    id: '2',
    name: 'Jane Smith',
    email: 'student@example.com',
    role: 'student' as UserRole,
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'student' as UserRole,
  },
];

export const mockExams: Exam[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript in this multi-stage exam.',
    createdBy: '1',
    createdAt: '2024-04-01T12:00:00Z',
    isPublished: true,
    stages: [
      {
        id: '1-1',
        title: 'HTML Fundamentals',
        description: 'Test your knowledge of HTML structure, tags, and attributes.',
        order: 1,
        duration: 30,
        passingScore: 70,
        questions: [
          {
            id: '1-1-1',
            text: 'What does HTML stand for?',
            type: 'multiple-choice',
            options: [
              'Hyper Text Markup Language',
              'Hyper Transfer Markup Language',
              'High Tech Markup Language',
              'Hyperlink and Text Markup Language',
            ],
            correctAnswer: 'Hyper Text Markup Language',
            points: 5,
          },
          {
            id: '1-1-2',
            text: 'Which tag is used to create a hyperlink?',
            type: 'multiple-choice',
            options: ['<link>', '<a>', '<href>', '<url>'],
            correctAnswer: '<a>',
            points: 5,
          },
          {
            id: '1-1-3',
            text: 'HTML is a programming language.',
            type: 'true-false',
            correctAnswer: 'false',
            points: 5,
          },
        ],
      },
      {
        id: '1-2',
        title: 'CSS Basics',
        description: 'Demonstrate your understanding of CSS selectors, properties, and values.',
        order: 2,
        duration: 30,
        passingScore: 70,
        questions: [
          {
            id: '1-2-1',
            text: 'What property is used to change the background color of an element?',
            type: 'multiple-choice',
            options: ['color', 'background-color', 'bgcolor', 'background'],
            correctAnswer: 'background-color',
            points: 5,
          },
          {
            id: '1-2-2',
            text: 'Which CSS selector targets elements with a specific class?',
            type: 'multiple-choice',
            options: ['#', '.', '*', '&'],
            correctAnswer: '.',
            points: 5,
          },
          {
            id: '1-2-3',
            text: 'CSS can only be applied inline within HTML elements.',
            type: 'true-false',
            correctAnswer: 'false',
            points: 5,
          },
        ],
      },
      {
        id: '1-3',
        title: 'JavaScript Essentials',
        description: 'Test your JavaScript skills with questions about variables, functions, and DOM manipulation.',
        order: 3,
        duration: 45,
        passingScore: 70,
        questions: [
          {
            id: '1-3-1',
            text: 'Which keyword is used to declare a variable in modern JavaScript?',
            type: 'multiple-choice',
            options: ['var', 'let', 'variable', 'const'],
            correctAnswer: ['let', 'const'],
            points: 5,
          },
          {
            id: '1-3-2',
            text: 'What method is used to add an element to the end of an array?',
            type: 'multiple-choice',
            options: ['push()', 'append()', 'add()', 'insert()'],
            correctAnswer: 'push()',
            points: 5,
          },
          {
            id: '1-3-3',
            text: 'JavaScript is a statically typed language.',
            type: 'true-false',
            correctAnswer: 'false',
            points: 5,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Advanced React Development',
    description: 'Master React hooks, context, and state management in this advanced exam.',
    createdBy: '1',
    createdAt: '2024-04-05T14:30:00Z',
    isPublished: true,
    stages: [
      {
        id: '2-1',
        title: 'React Fundamentals',
        description: 'Understand React components, props, and state management.',
        order: 1,
        duration: 45,
        passingScore: 70,
        questions: [
          {
            id: '2-1-1',
            text: 'What is JSX?',
            type: 'multiple-choice',
            options: [
              'A JavaScript XML syntax extension',
              'A new programming language',
              'A type of React component',
              'A state management library',
            ],
            correctAnswer: 'A JavaScript XML syntax extension',
            points: 10,
          },
          {
            id: '2-1-2',
            text: 'React components must always return a single root element.',
            type: 'true-false',
            correctAnswer: 'true',
            points: 10,
          },
        ],
      },
      {
        id: '2-2',
        title: 'React Hooks',
        description: 'Learn about useState, useEffect, and custom hooks.',
        order: 2,
        duration: 60,
        passingScore: 80,
        questions: [
          {
            id: '2-2-1',
            text: 'Which hook is used to perform side effects in a functional component?',
            type: 'multiple-choice',
            options: ['useState', 'useEffect', 'useContext', 'useReducer'],
            correctAnswer: 'useEffect',
            points: 10,
          },
          {
            id: '2-2-2',
            text: 'Hooks can be called conditionally inside React components.',
            type: 'true-false',
            correctAnswer: 'false',
            points: 10,
          },
        ],
      },
    ],
  },
];

export const mockStudentProgress: StudentProgress[] = [
  {
    studentId: '2',
    examId: '1',
    stageId: '1-1',
    completed: true,
    score: 80,
    passed: true,
    startedAt: '2024-04-10T09:15:00Z',
    completedAt: '2024-04-10T09:40:00Z',
  },
  {
    studentId: '2',
    examId: '1',
    stageId: '1-2',
    completed: false,
    score: 0,
    passed: false,
    startedAt: '2024-04-10T10:00:00Z',
  },
];

// Helper functions
export const getAvailableExams = (studentId: string) => {
  return mockExams.filter(exam => exam.isPublished);
};

export const getExamById = (examId: string) => {
  return mockExams.find(exam => exam.id === examId);
};

export const getStudentProgress = (studentId: string, examId: string) => {
  return mockStudentProgress.filter(
    progress => progress.studentId === studentId && progress.examId === examId
  );
};

export const getExamStageById = (examId: string, stageId: string) => {
  const exam = getExamById(examId);
  return exam?.stages.find(stage => stage.id === stageId);
};

export const canAccessStage = (studentId: string, examId: string, stageId: string) => {
  const exam = getExamById(examId);
  if (!exam) return false;
  
  const stage = exam.stages.find(s => s.id === stageId);
  if (!stage) return false;
  
  // If it's the first stage, they can access it
  if (stage.order === 1) return true;
  
  // Find the previous stage
  const previousStage = exam.stages.find(s => s.order === stage.order - 1);
  if (!previousStage) return true;
  
  // Check if they've passed the previous stage
  const progress = mockStudentProgress.find(
    p => p.studentId === studentId && p.examId === examId && p.stageId === previousStage.id
  );
  
  return progress?.passed === true;
};

export const getStudentsForInstructor = () => {
  return mockStudents;
};

export const getExamsCreatedByInstructor = (instructorId: string) => {
  return mockExams.filter(exam => exam.createdBy === instructorId);
};