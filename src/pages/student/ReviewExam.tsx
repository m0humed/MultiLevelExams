import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ReviewExam = () => {
  const { user } = useAuth();
  const { examId, stageId } = useParams<{ examId: string; stageId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<any>(null);

  // Move these hooks to the top
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  useEffect(() => {
    fetch(`https://multilevelexambackend-production.up.railway.app/api/exams/stages/${stageId}`)
      .then(res => res.json())
      .then(data => setAllQuestions(data.questions || []));
  }, [stageId]);

  useEffect(() => {
    if (!user || !examId || !stageId) return;

    // Fetch stage info (for title/description)
    fetch(`https://multilevelexambackend-production.up.railway.app/api/exams/stages/${stageId}`)
      .then(res => res.json())
      .then(data => setStage(data));

    // Fetch review data (student answers + questions + options)
    fetch(`https://multilevelexambackend-production.up.railway.app/api/exams/reviewdetails?studentId=${user.id}&examId=${examId}&stageId=${stageId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.answers) {
          setQuestions(data.answers.map((a: any) => ({
            ...a,
            options: a.options || []
          })));
          setAnswers(data.answers);
        }
        setLoading(false);
      });
  }, [user, examId, stageId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  if (!stage || !answers.length) {
    return (
      <div className="p-8 text-center text-error-700">
        No completed attempt found for this stage.<br />
        <button
          className="mt-4 rounded bg-primary-600 px-4 py-2 text-white"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  // Map student answers by question_id for quick lookup
  const answersMap = Object.fromEntries(
    answers.map((a: any) => [a.question_id, a])
  );

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="mb-2 text-2xl font-bold">{stage.name}</h2>
      <h3 className="mb-6 text-lg font-semibold">{stage.description}</h3>
      <div className="space-y-6">
        {allQuestions.map((question: any, idx: number) => {
          const answerObj = answersMap[question.question_id];
          const studentAnswer = answerObj?.selected_answer;
          const isCorrect = answerObj?.is_correct;
          // Find correct option
          const correctOption = question.options?.find((opt: any) => opt.option_text === question.correct_answer);
          return (
            <div key={question.question_id} className="rounded-md border p-4 bg-gray-50">
              <div className="font-medium mb-2 flex items-center gap-2">
                {idx + 1}. {question.question_text}
                {isCorrect === true && <CheckCircle className="text-success-600" size={20} />}
                {isCorrect === false && <XCircle className="text-error-600" size={20} />}
              </div>
              <div className="space-y-2 mb-2">
                {question.options?.map((opt: any) => {
                  const isStudent = studentAnswer === opt.option_text;
                  const isCorrectChoice = question.correct_answer === opt.option_text;
                  return (
                    <div
                      key={opt.option_id}
                      className={`flex items-center gap-2 rounded px-3 py-2 border
                        ${isCorrectChoice ? 'border-success-500 bg-success-50' : 'border-gray-200'}
                        ${isStudent ? 'ring-2 ring-primary-400' : ''}
                      `}
                    >
                      <span className="font-bold">{opt.option_letter}.</span>
                      <span>{opt.option_text}</span>
                      {isCorrectChoice && (
                        <span className="ml-2 text-success-700 text-xs font-semibold">(Correct)</span>
                      )}
                      {isStudent && (
                        <span className="ml-2 text-primary-700 text-xs font-semibold">(Your choice)</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-sm">
                <span className="font-semibold">Explanation: </span>
                <span>{question.explanation || 'No explanation provided.'}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex justify-center">
        <button
          className="rounded bg-primary-600 px-6 py-2 text-white hover:bg-primary-700"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ReviewExam;