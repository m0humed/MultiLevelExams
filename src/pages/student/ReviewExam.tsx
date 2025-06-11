import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getExamById, getExamStageById, Exam, ExamStage, Question, mockStudentProgress } from '../../data/mockData';

const ReviewExam = () => {
  const { user } = useAuth();
  const { examId, stageId } = useParams<{ examId: string; stageId: string }>();
  const navigate = useNavigate();

  if (!user || !examId || !stageId) {
    return <div className="p-8 text-center text-error-700">Invalid review request.</div>;
  }

  const exam: Exam | null = getExamById(examId) ?? null;
  const stage: ExamStage | null = getExamStageById(examId, stageId) ?? null;

  if (!exam || !stage) {
    return <div className="p-8 text-center text-error-700">Exam or stage not found.</div>;
  }

  const progress = mockStudentProgress.find(
    p => p.studentId === user.id && p.examId === examId && p.stageId === stageId && p.completed
  );

  if (!progress || !progress.answers) {
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

  const answers = progress.answers;

  const renderAnswerComparison = (question: Question) => {
    const studentAnswer = answers[question.id];
    const correctAnswer = Array.isArray(question.correctAnswer)
      ? question.correctAnswer.join(', ')
      : question.correctAnswer;

    const isCorrect = Array.isArray(question.correctAnswer)
      ? Array.isArray(studentAnswer) &&
        question.correctAnswer.length === studentAnswer.length &&
        question.correctAnswer.every(ans => (studentAnswer as string[]).includes(ans))
      : studentAnswer === question.correctAnswer;

    return (
      <div className="mt-2">
        <div>
          <span className="font-semibold">Your answer: </span>
          <span className={isCorrect ? 'text-success-700' : 'text-error-700'}>
            {Array.isArray(studentAnswer)
              ? (studentAnswer as string[]).join(', ')
              : studentAnswer || <span className="italic text-gray-400">No answer</span>}
          </span>
        </div>
        <div>
          <span className="font-semibold">Correct answer: </span>
          <span className="text-success-700">{correctAnswer}</span>
        </div>
        {!isCorrect && (
          <div className="mt-1 text-xs text-error-600">Incorrect</div>
        )}
        {isCorrect && (
          <div className="mt-1 text-xs text-success-600">Correct</div>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="mb-2 text-2xl font-bold">{exam.title}</h2>
      <h3 className="mb-6 text-lg font-semibold">{stage.title}</h3>
      <div className="space-y-6">
        {stage.questions.map((question, idx) => (
          <div key={question.id} className="rounded-md border p-4 bg-gray-50">
            <div className="font-medium mb-2">
              {idx + 1}. {question.text}
            </div>
            {renderAnswerComparison(question)}
          </div>
        ))}
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