import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle, XCircle, Printer, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

interface ReviewProps {
  examTitle: string;
  stageTitle: string;
  questions: Question[];
  userAnswers: { [key: string]: string | string[] };
  score: number;
  submittedAt: Date;
  onBack: () => void;
  onRetry: () => void;
}

const Review = ({
  examTitle,
  stageTitle,
  questions,
  userAnswers,
  score,
  submittedAt,
  onBack,
  onRetry
}: ReviewProps) => {
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const isAnswerCorrect = (question: Question, userAnswer: string | string[]) => {
    if (Array.isArray(question.correctAnswer)) {
      if (Array.isArray(userAnswer)) {
        return question.correctAnswer.length === userAnswer.length &&
          question.correctAnswer.every(ans => userAnswer.includes(ans));
      }
      return false;
    }
    return userAnswer === question.correctAnswer;
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Exam Review: {examTitle}
          </h1>
          <p className="mt-1 text-gray-600">{stageTitle}</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ChevronLeft size={16} className="mr-2" />
            Back to Results
          </button>
          
          <button
            onClick={handlePrint}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 print:hidden"
          >
            <Printer size={16} className="mr-2" />
            Print Review
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Final Score</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{score}%</p>
        </div>
        
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Questions Correct</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {questions.filter(q => isAnswerCorrect(q, userAnswers[q.id])).length} / {questions.length}
          </p>
        </div>
        
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Submitted At</p>
          <p className="mt-1 text-lg font-medium text-gray-900">
            {submittedAt.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Questions Review */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const userAnswer = userAnswers[question.id];
          const isCorrect = isAnswerCorrect(question, userAnswer);
          
          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question {index + 1}
                </h3>
                {isCorrect ? (
                  <span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-sm font-medium text-success-800">
                    <CheckCircle size={14} className="mr-1" />
                    Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-error-100 px-2.5 py-0.5 text-sm font-medium text-error-800">
                    <XCircle size={14} className="mr-1" />
                    Incorrect
                  </span>
                )}
              </div>

              <p className="mb-6 text-gray-700">{question.text}</p>

              <div className="grid gap-6 md:grid-cols-2">
                {/* User Answer */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">Your Answer:</h4>
                  <div className={`rounded-lg border p-4 ${
                    isCorrect ? 'border-success-200 bg-success-50' : 'border-error-200 bg-error-50'
                  }`}>
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`flex items-center rounded-md p-2 ${
                              userAnswer === option
                                ? isCorrect
                                  ? 'bg-success-100 text-success-800'
                                  : 'bg-error-100 text-error-800'
                                : 'bg-white'
                            }`}
                          >
                            <input
                              type="radio"
                              checked={userAnswer === option}
                              readOnly
                              className="h-4 w-4"
                            />
                            <span className="ml-2">{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'true-false' && (
                      <div className="space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={userAnswer === 'true'}
                            readOnly
                            className="h-4 w-4"
                          />
                          <span className="ml-2">True</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={userAnswer === 'false'}
                            readOnly
                            className="h-4 w-4"
                          />
                          <span className="ml-2">False</span>
                        </label>
                      </div>
                    )}
                    
                    {question.type === 'short-answer' && (
                      <p className="text-gray-700">{userAnswer as string}</p>
                    )}
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">Correct Answer:</h4>
                  <div className="rounded-lg border border-success-200 bg-success-50 p-4">
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`flex items-center rounded-md p-2 ${
                              option === question.correctAnswer
                                ? 'bg-success-100 text-success-800'
                                : 'bg-white'
                            }`}
                          >
                            <input
                              type="radio"
                              checked={option === question.correctAnswer}
                              readOnly
                              className="h-4 w-4"
                            />
                            <span className="ml-2">{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'true-false' && (
                      <div className="space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={question.correctAnswer === 'true'}
                            readOnly
                            className="h-4 w-4"
                          />
                          <span className="ml-2">True</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            checked={question.correctAnswer === 'false'}
                            readOnly
                            className="h-4 w-4"
                          />
                          <span className="ml-2">False</span>
                        </label>
                      </div>
                    )}
                    
                    {question.type === 'short-answer' && (
                      <p className="text-gray-700">{question.correctAnswer as string}</p>
                    )}
                  </div>
                </div>
              </div>

              {!isCorrect && (
                <div className="mt-4 rounded-lg bg-primary-50 p-4">
                  <p className="text-sm font-medium text-primary-800">
                    Explanation:
                  </p>
                  <p className="mt-1 text-sm text-primary-700">
                    The correct answer is shown above. Review the material related to this topic to better understand the concept.
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
        <Link
          to="/exams"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Home size={16} className="mr-2" />
          Back to Exams
        </Link>
        
        {score < 70 && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <CheckCircle size={16} className="mr-2" />
            Retry Stage
          </button>
        )}
      </div>

      {/* Print styles */}
      <style type="text/css" media="print">
        {`
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        `}
      </style>
    </div>
  );
};

export default Review;