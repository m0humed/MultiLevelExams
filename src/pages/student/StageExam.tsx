import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getExamById,
  getExamStageById,
  canAccessStage,
  Exam,
  ExamStage,
  Question,
} from '../../data/mockData';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';

const StageExam = () => {
  const { user } = useAuth();
  const { examId, stageId } = useParams<{ examId: string; stageId: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [stage, setStage] = useState<ExamStage | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string | string[] }>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [examState, setExamState] = useState<'loading' | 'in_progress' | 'submitting' | 'completed'>('loading');
  const [examResult, setExamResult] = useState<{
    score: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
  } | null>(null);

  useEffect(() => {
    if (!examId || !stageId || !user) return;

    // Check if user can access this stage
    const canAccess = canAccessStage(user.id, examId, stageId);
    if (!canAccess) {
      navigate(`/exams/${examId}`);
      return;
    }

    // Get exam and stage details
    const examData = getExamById(examId);
    const stageData = getExamStageById(examId, stageId);

    if (!examData || !stageData) {
      navigate('/404');
      return;
    }

    setExam(examData);
    setStage(stageData);
    setTimeLeft(stageData.duration * 60); // Convert minutes to seconds
    setExamState('in_progress');

    // Initialize empty answers
    const initialAnswers: { [questionId: string]: string | string[] } = {};
    stageData.questions.forEach(question => {
      initialAnswers[question.id] = question.type === 'multiple-choice' ? '' : '';
    });
    setAnswers(initialAnswers);
  }, [examId, stageId, user, navigate]);

  // Timer effect
  useEffect(() => {
    if (examState !== 'in_progress' || !timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, examState]);

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToNextQuestion = () => {
    if (stage && currentQuestionIndex < stage.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!stage) return;
    
    setExamState('submitting');
    
    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    
    stage.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer;
      
      // Compare answers based on question type
      let isCorrect = false;
      
      if (Array.isArray(correctAnswer)) {
        if (Array.isArray(userAnswer)) {
          isCorrect = correctAnswer.length === userAnswer.length && 
                      correctAnswer.every(ans => userAnswer.includes(ans));
        }
      } else {
        isCorrect = userAnswer === correctAnswer;
      }
      
      if (isCorrect) {
        correctAnswers += question.points;
      }
      
      totalPoints += question.points;
    });
    
    const scorePercentage = Math.round((correctAnswers / totalPoints) * 100);
    const passed = scorePercentage >= stage.passingScore;
    
    // Simulate API call to save results
    setTimeout(() => {
      setExamResult({
        score: scorePercentage,
        passed,
        correctAnswers: correctAnswers,
        totalQuestions: stage.questions.length,
      });
      setExamState('completed');
    }, 1500);
  };

  const resetStage = () => {
    if (!stage) return;
    setCurrentQuestionIndex(0);
    setAnswers(
      stage.questions.reduce((acc, q) => {
        acc[q.id] = q.type === 'multiple-choice' ? '' : '';
        return acc;
      }, {} as { [questionId: string]: string | string[] })
    );
    setTimeLeft(stage.duration * 60);
    setExamState('in_progress');
    setExamResult(null);
  };

  if (examState === 'loading' || !stage || !exam) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  const currentQuestion = stage.questions[currentQuestionIndex];
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (examState === 'completed' && examResult) {
    return (
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg bg-white p-6 shadow-md"
        >
          <div className="text-center">
            {examResult.passed ? (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
                <CheckCircle size={40} className="text-success-500" />
              </div>
            ) : (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-error-100">
                <XCircle size={40} className="text-error-500" />
              </div>
            )}
            
            <h2 className="text-2xl font-bold">
              {examResult.passed ? 'Stage Completed!' : 'Stage Not Passed'}
            </h2>
            
            <p className="mt-2 text-gray-600">
              {examResult.passed
                ? 'Congratulations! You have passed this stage.'
                : `You didn't meet the minimum passing score. You can retry this stage.`}
            </p>
            
            <div className="mt-8 flex flex-col items-center space-y-4">
              <div className="flex w-full max-w-xs flex-col gap-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">Your Score:</span>
                  <span className="text-lg font-semibold text-gray-900">{examResult.score}%</span>
                </div>
                
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">Passing Score:</span>
                  <span className="text-lg font-semibold text-gray-900">{stage.passingScore}%</span>
                </div>
                
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full ${
                      examResult.passed ? 'bg-success-500' : 'bg-error-500'
                    }`}
                    style={{ width: `${examResult.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <button
                onClick={() => navigate(`/exams/${examId}`)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Home size={16} className="mr-2" />
                Back to Exam
              </button>
              
              {examResult.passed && (
                <button
                  onClick={() => navigate(`/exams/${examId}`)}
                  className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  <ArrowRight size={16} className="mr-2" />
                  Continue to Next Stage
                </button>
              )}
              
              
              {!examResult.passed && (
                <button
                  onClick={resetStage}
                  className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  <ArrowRight size={16} className="mr-2" />
                  Try Again
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
    
  }


  if (examState === 'submitting') {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
        <p className="text-gray-600">Submitting your answers...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Exam header */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm md:p-6">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          {exam.title} - {stage.title}
        </h1>
        
        <div className="mt-4 flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          {/* Progress */}
          <div>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {stage.questions.length}
            </p>
            <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-primary-500"
                style={{
                  width: `${((currentQuestionIndex + 1) / stage.questions.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          
          {/* Timer */}
          <div className="flex items-center">
            <Clock size={18} className="mr-2 text-gray-500" />
            <span className={`font-medium ${timeLeft < 60 ? 'text-error-600' : 'text-gray-700'}`}>
              Time left: {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Question card */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg bg-white p-4 shadow-md md:p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 md:text-xl">
          {currentQuestionIndex + 1}. {currentQuestion.text}
        </h2>
        
        <div className="mt-6">
          {/* Multiple choice question */}
          {currentQuestion.type === 'multiple-choice' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <label
                  key={index}
                  className="flex cursor-pointer items-center rounded-md border border-gray-200 p-3 hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleAnswerChange(currentQuestion.id, option)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}
          
          {/* True-false question */}
          {currentQuestion.type === 'true-false' && (
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value="true"
                  checked={answers[currentQuestion.id] === 'true'}
                  onChange={() => handleAnswerChange(currentQuestion.id, 'true')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700">True</span>
              </label>
              <label className="flex cursor-pointer items-center rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value="false"
                  checked={answers[currentQuestion.id] === 'false'}
                  onChange={() => handleAnswerChange(currentQuestion.id, 'false')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-gray-700">False</span>
              </label>
            </div>
          )}
          
          {/* Short answer question */}
          {currentQuestion.type === 'short-answer' && (
            <div>
              <textarea
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full rounded-md border border-gray-300 p-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                rows={4}
                placeholder="Type your answer here..."
              ></textarea>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Previous
        </button>
        
        {currentQuestionIndex < stage.questions.length - 1 ? (
          <button
            onClick={goToNextQuestion}
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Next
            <ArrowRight size={16} className="ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Submit Exam
            <CheckCircle size={16} className="ml-2" />
          </button>
        )}
      </div>
      
      {/* Question navigation dots */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {stage.questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
              index === currentQuestionIndex
                ? 'bg-primary-600 text-white'
                : answers[stage.questions[index].id]
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      {/* Warning message */}
      {timeLeft < 60 && (
        <div className="mt-4 flex items-center rounded-md bg-error-50 p-3 text-error-800">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <p className="text-sm">Less than a minute remaining! Your exam will be automatically submitted when time runs out.</p>
        </div>
      )}
    </div>
  );
};

export default StageExam;