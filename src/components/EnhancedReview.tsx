import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  BookOpen,
  BarChart3,
  Printer,
  Home,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { EnhancedQuestion, StudentAnswer, PerformanceMetrics, QuestionOption } from '../types/assessment';

interface EnhancedReviewProps {
  examTitle: string;
  stageTitle: string;
  questions: EnhancedQuestion[];
  studentAnswers: StudentAnswer[];
  performanceMetrics: PerformanceMetrics;
  submittedAt: Date;
  onBack: () => void;
  onRetry?: () => void;
  allowRetry?: boolean;
}

const EnhancedReview = ({
  examTitle,
  stageTitle,
  questions,
  studentAnswers,
  performanceMetrics,
  submittedAt,
  onBack,
  onRetry,
  allowRetry = false
}: EnhancedReviewProps) => {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [showExplanations, setShowExplanations] = useState(true);
  const [showMisconceptions, setShowMisconceptions] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'incorrect'>('all');

  const getStudentAnswer = (questionId: string) => {
    return studentAnswers.find(answer => answer.questionId === questionId);
  };

  const getFilteredQuestions = () => {
    if (filterType === 'all') return questions;
    
    return questions.filter(question => {
      const answer = getStudentAnswer(question.id);
      if (filterType === 'correct') return answer?.isCorrect;
      if (filterType === 'incorrect') return answer && !answer.isCorrect;
      return true;
    });
  };

  const filteredQuestions = getFilteredQuestions();
  const currentQuestion = filteredQuestions[selectedQuestionIndex];
  const currentAnswer = currentQuestion ? getStudentAnswer(currentQuestion.id) : null;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getOptionStyle = (option: QuestionOption, selectedAnswer?: string) => {
    const isSelected = selectedAnswer === option.text;
    const isCorrect = option.isCorrect;
    
    if (isSelected && isCorrect) {
      return 'border-success-500 bg-success-50 text-success-800';
    } else if (isSelected && !isCorrect) {
      return 'border-error-500 bg-error-50 text-error-800';
    } else if (isCorrect) {
      return 'border-success-300 bg-success-25 text-success-700';
    }
    return 'border-gray-200 bg-white text-gray-700';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Assessment Review: {examTitle}
          </h1>
          <p className="mt-1 text-gray-600">{stageTitle}</p>
          <p className="text-sm text-gray-500">
            Submitted on {submittedAt.toLocaleString()}
          </p>
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

      {/* Performance Summary */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <BarChart3 size={20} className="mr-2 text-primary-600" />
            <div>
              <p className="text-sm text-gray-600">Final Score</p>
              <p className="text-2xl font-bold text-gray-900">{performanceMetrics.percentage}%</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <CheckCircle size={20} className="mr-2 text-success-600" />
            <div>
              <p className="text-sm text-gray-600">Correct Answers</p>
              <p className="text-2xl font-bold text-gray-900">
                {performanceMetrics.questionsCorrect} / {performanceMetrics.totalQuestions}
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <Clock size={20} className="mr-2 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(performanceMetrics.timeSpent)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center">
            <BookOpen size={20} className="mr-2 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Average Time/Question</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(Math.round(performanceMetrics.timeSpent / performanceMetrics.totalQuestions))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Performance by Category</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(performanceMetrics.categoryPerformance).map(([category, performance]) => (
            <div key={category} className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-medium text-gray-900 capitalize">{category}</h4>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {performance.correct} / {performance.total}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {performance.percentage}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full ${
                    performance.percentage >= 70 ? 'bg-success-500' : 
                    performance.percentage >= 50 ? 'bg-warning-500' : 'bg-error-500'
                  }`}
                  style={{ width: `${performance.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Question Navigation */}
        <div className="lg:col-span-1">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Questions</h3>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'correct' | 'incorrect')}
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="correct">Correct</option>
                <option value="incorrect">Incorrect</option>
              </select>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredQuestions.map((question, index) => {
                const answer = getStudentAnswer(question.id);
                const isSelected = selectedQuestionIndex === index;
                
                return (
                  <button
                    key={question.id}
                    onClick={() => setSelectedQuestionIndex(index)}
                    className={`w-full rounded-md border p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Q{questions.indexOf(question) + 1}</span>
                      {answer?.isCorrect ? (
                        <CheckCircle size={16} className="text-success-500" />
                      ) : (
                        <XCircle size={16} className="text-error-500" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-600 truncate">
                      {question.text}
                    </p>
                    {answer && (
                      <p className="mt-1 text-xs text-gray-500">
                        Time: {formatTime(answer.timeSpent)}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="lg:col-span-3">
          {currentQuestion && currentAnswer ? (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              {/* Question Header */}
              <div className="mb-6 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Question {questions.indexOf(currentQuestion) + 1}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {currentQuestion.difficulty}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                      {currentQuestion.category}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {currentQuestion.points} points
                    </span>
                  </div>
                </div>
                
                <div className="ml-4 text-right">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {formatTime(currentAnswer.timeSpent)}
                    </span>
                  </div>
                  {currentAnswer.isCorrect ? (
                    <span className="mt-1 inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-800">
                      <CheckCircle size={12} className="mr-1" />
                      Correct
                    </span>
                  ) : (
                    <span className="mt-1 inline-flex items-center rounded-full bg-error-100 px-2.5 py-0.5 text-xs font-medium text-error-800">
                      <XCircle size={12} className="mr-1" />
                      Incorrect
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <p className="text-lg text-gray-900">{currentQuestion.text}</p>
              </div>

              {/* Answer Options */}
              <div className="mb-6 space-y-3">
                <h4 className="font-medium text-gray-900">Answer Options:</h4>
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={option.id}
                    className={`rounded-lg border-2 p-4 transition-colors ${getOptionStyle(
                      option,
                      currentAnswer.selectedAnswer
                    )}`}
                  >
                    <div className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                        {option.letter}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900">{option.text}</p>
                        
                        {/* Show indicators */}
                        <div className="mt-2 flex items-center gap-2">
                          {currentAnswer.selectedAnswer === option.text && (
                            <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                              Your Answer
                            </span>
                          )}
                          {option.isCorrect && (
                            <span className="inline-flex items-center rounded-full bg-success-100 px-2 py-0.5 text-xs font-medium text-success-800">
                              Correct Answer
                            </span>
                          )}
                        </div>

                        {/* Show misconception for incorrect selected answers */}
                        {showMisconceptions && 
                         currentAnswer.selectedAnswer === option.text && 
                         !option.isCorrect && 
                         option.misconception && (
                          <div className="mt-3 rounded-md bg-orange-50 p-3">
                            <div className="flex items-start">
                              <AlertTriangle size={16} className="mr-2 mt-0.5 text-orange-500" />
                              <div>
                                <p className="text-sm font-medium text-orange-800">Common Misconception:</p>
                                <p className="text-sm text-orange-700">{option.misconception}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Explanation */}
              {showExplanations && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="flex items-start">
                    <BookOpen size={20} className="mr-3 mt-0.5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-blue-900">Explanation:</h4>
                      <p className="mt-1 text-blue-800">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Answer Revision History */}
              {currentAnswer.revisionHistory && currentAnswer.revisionHistory.length > 0 && (
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <h4 className="font-medium text-gray-900">Answer History:</h4>
                  <div className="mt-2 space-y-2">
                    {currentAnswer.revisionHistory.map((revision, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        <span className="font-medium">Previous answer:</span> {revision.previousAnswer}
                        <span className="ml-2 text-gray-500">
                          (changed at {revision.changedAt.toLocaleTimeString()})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-sm">
              <p className="text-gray-500">No questions to review</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {showExplanations ? <EyeOff size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
            {showExplanations ? 'Hide' : 'Show'} Explanations
          </button>
          
          <button
            onClick={() => setShowMisconceptions(!showMisconceptions)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <AlertTriangle size={16} className="mr-2" />
            {showMisconceptions ? 'Hide' : 'Show'} Misconceptions
          </button>
        </div>

        <div className="flex gap-3">
          <Link
            to="/exams"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Home size={16} className="mr-2" />
            Back to Exams
          </Link>
          
          {allowRetry && onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <RefreshCw size={16} className="mr-2" />
              Retry Assessment
            </button>
          )}
        </div>
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
          .print\\:hidden {
            display: none !important;
          }
        `}
      </style>
    </div>
  );
};

export default EnhancedReview;