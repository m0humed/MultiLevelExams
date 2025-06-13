import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, ArrowRight, Clock, AlertCircle, CheckCircle, XCircle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const StageExam = () => {
  const { user } = useAuth();
  const { examId, stageId } = useParams<{ examId: string; stageId: string }>();
  const navigate = useNavigate();

  const [stage, setStage] = useState<any>(null);
  const [exam, setExam] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [examResult, setExamResult] = useState<{
    score: number;
    passed: boolean;
    correctAnswers: number;
    totalQuestions: number;
  } | null>(null);
  const [examState, setExamState] = useState<'loading' | 'in_progress' | 'submitting' | 'completed'>('loading');

  // Fetch stage and questions
  useEffect(() => {
    if (!stageId) return;
    fetch(`https://multilevelexambackend-production.up.railway.app/api/exams/stages/${stageId}`)
      .then(res => res.json())
      .then(data => {
        setStage(data);
        setTimeLeft(data.time_limit * 60);
        setLoading(false);
        setExamState('in_progress');
        setCurrentQuestionIndex(0);
        // Initialize empty answers
        const initialAnswers: { [questionId: string]: string } = {};
        data.questions.forEach((q: any) => {
          initialAnswers[q.question_id] = '';
        });
        setAnswers(initialAnswers);
      });
  }, [stageId]);

  // Fetch exam info (for title)
  useEffect(() => {
    if (!examId) return;
    fetch(`https://multilevelexambackend-production.up.railway.app/api/exams/details/${examId}`)
      .then(res => res.json())
      .then(data => setExam(data));
  }, [examId]);

  // // Fetch review data if already submitted
  // useEffect(() => {
  //   if (!user || !examId || !stageId) return;

  //   fetch(`/api/exams/review?studentId=${user.id}&examId=${examId}&stageId=${stageId}`)
  //     .then(res => res.json())
  //     .then data => {
  //       // Only set review if the user has already submitted before (session.status === 'completed')
  //       if (data.session && data.session.status === 'completed') {
  //         setReviewData(data);
  //         setSubmitted(true);
  //         setExamState('completed');
  //       }
  //     });
  // }, [user, examId, stageId]);

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

  if (loading || !stage) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const allQuestionsAnswered = stage.questions.every(
    (q: any) => answers[q.question_id] && answers[q.question_id].trim() !== ''
  );

  // Submit answers to backend
  const handleSubmit = async () => {
    if (!user || !examId || !stageId) return;
    setExamState('submitting');
    const payload = {
      studentId: user.id,
      examId,
      stageId,
      answers: stage.questions.map((q: any) => ({
        questionId: q.question_id,
        selectedAnswer: answers[q.question_id],
        isCorrect: q.correct_answer === answers[q.question_id],
      })),
    };
    const res = await fetch(`https://multilevelexambackend-production.up.railway.app/api/exams/submit-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (res.ok && result.success) {
      setSubmitted(true);
      setExamState('completed');
      // Fetch review data and show review page
      fetch(`https://multilevelexambackend-production.up.railway.app/api/exams/review?studentId=${user.id}&examId=${examId}&stageId=${stageId}`)
        .then(res => {
          if (res.status === 200) {
            return res.json();
          }
          return null;
        })
        .then(data => {
          if (data && data.session) {
            setReviewData(data);
          }
        });
    }
  };

  const resetStage = () => {
    setCurrentQuestionIndex(0);
    setAnswers(
      stage.questions.reduce((acc: any, q: any) => {
        acc[q.question_id] = '';
        return acc;
      }, {})
    );
    setTimeLeft(stage.time_limit * 60);
    setExamState('in_progress');
    setExamResult(null);
    setSubmitted(false);
    setReviewData(null);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const question = stage.questions[currentQuestionIndex];

  if (examState === 'completed' && reviewData) {
    // Calculate score and pass/fail
    let correctAnswers = 0;
    stage.questions.forEach((q: any) => {
      const answerObj = reviewData.answers.find((a: any) => a.question_id === q.question_id);
      if (answerObj?.is_correct) correctAnswers++;
    });
    const scorePercentage = Math.round((correctAnswers / stage.questions.length) * 100);
    const passed = scorePercentage >= stage.passing_score;

    return (
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg bg-white p-6 shadow-md"
        >
          <div className="text-center">
            {passed ? (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success-100">
                <CheckCircle size={40} className="text-success-500" />
              </div>
            ) : (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-error-100">
                <XCircle size={40} className="text-error-500" />
              </div>
            )}

            <h2 className="text-2xl font-bold">
              {passed ? 'Stage Completed!' : 'Stage Not Passed'}
            </h2>

            <p className="mt-2 text-gray-600">
              {passed
                ? 'Congratulations! You have passed this stage.'
                : `You didn't meet the minimum passing score. You can retry this stage.`}
            </p>

            <div className="mt-8 flex flex-col items-center space-y-4">
              <div className="flex w-full max-w-xs flex-col gap-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">Your Score:</span>
                  <span className="text-lg font-semibold text-gray-900">{scorePercentage}%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-sm text-gray-600">Passing Score:</span>
                  <span className="text-lg font-semibold text-gray-900">{stage.passing_score}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full ${
                      passed ? 'bg-success-500' : 'bg-error-500'
                    }`}
                    style={{ width: `${scorePercentage}%` }}
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
              <button
                onClick={() => navigate(`/exams/${examId}/stage/${stageId}/review`)}
                className="inline-flex items-center justify-center rounded-md border border-primary-300 bg-white px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50"
              >
                <CheckCircle size={16} className="mr-2" />
                Review Answers
              </button>
              {passed && (
                <button
                  onClick={() => navigate(`/exams/${examId}`)}
                  className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  <ArrowRight size={16} className="mr-2" />
                  Continue to Next Stage
                </button>
              )}
              {!passed && (
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
          {exam?.name} - {stage.name}
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
        key={question.question_id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg bg-white p-4 shadow-md md:p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 md:text-xl">
          {currentQuestionIndex + 1}. {question.question_text}
        </h2>
        <div className="mt-6">
          <div className="space-y-3">
            {question.options && question.options.length > 0 ? (
              question.options.map((opt: any, index: number) => (
                <label
                  key={opt.option_id || index}
                  className="flex cursor-pointer items-center rounded-md border border-gray-200 p-3 hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={question.question_id}
                    value={opt.option_text}
                    checked={answers[question.question_id] === opt.option_text}
                    onChange={() => handleAnswer(question.question_id, opt.option_text)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-gray-700">
                    {opt.option_letter ? `${opt.option_letter}. ` : ''}
                    {opt.option_text}
                  </span>
                </label>
              ))
            ) : (
              <div className="text-error-600 text-sm">No options available for this question.</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
          disabled={currentQuestionIndex === 0}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={16} className="mr-2" />
          Previous
        </button>
        {currentQuestionIndex < stage.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex(i => Math.min(stage.questions.length - 1, i + 1))}
            className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Next
            <ArrowRight size={16} className="ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
            className={`inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 ${
              !allQuestionsAnswered ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Submit Exam
            <CheckCircle size={16} className="ml-2" />
          </button>
        )}
      </div>

      {/* Question navigation dots */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {stage.questions.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
              index === currentQuestionIndex
                ? 'bg-primary-600 text-white'
                : answers[stage.questions[index].question_id]
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