import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, Clock, CheckCircle, XCircle, Lock as LockClosed, Play, Award } from 'lucide-react';
import { motion } from 'framer-motion';

type Stage = {
  stage_id: string;
  name: string;
  description: string;
  stage_order: number;
  passing_score: number;
  time_limit: number;
};

type Exam = {
  exam_id: string;
  name: string;
  description: string;
  stages: Stage[];
};

type StageProgress = {
  session_id: string;
  current_stage: number;
  status: string;
  passed?: boolean;
};

const ExamDetails = () => {
  const { user } = useAuth();
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [stageProgress, setStageProgress] = useState<{ [stageOrder: number]: StageProgress }>({});
  const [currentStageOrder, setCurrentStageOrder] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId || !user) return;

    // Fetch exam details (with stages)
    fetch(`/api/exams/details/${examId}`)
      .then(res => res.json())
      .then(data => setExam(data))
      .catch(() => navigate('/404'));

    // Fetch progress for this exam
    fetch(`/api/exams/${examId}/progress/${user.id}`)
      .then(res => res.json())
      .then(data => {
        // Map progress by stage order
        const progressMap: { [stageOrder: number]: StageProgress } = {};
        data.forEach((session: any) => {
          progressMap[session.current_stage] = session;
        });
        setStageProgress(progressMap);
        setLoading(false);
      });

    // Fetch current stage order for this student in this exam
    fetch(`/api/exams/${examId}/stage-progress/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setCurrentStageOrder(data.current_stage_order || 1);
      });
  }, [examId, user, navigate]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  if (!exam) {
    return null;
  }

  const calculateOverallProgress = () => {
    const totalStages = exam.stages.length;
    const completedStages = exam.stages.filter(
      (stage) => stageProgress[stage.stage_order]?.status === 'completed'
    ).length;
    return totalStages === 0 ? 0 : Math.round((completedStages / totalStages) * 100);
  };

  const isStageAccessible = (stageOrder: number) => {
    return stageOrder <= currentStageOrder;
  };

  const getStageStatus = (stage: Stage) => {
    const progress = stageProgress[stage.stage_order];
    if (!progress) {
      return isStageAccessible(stage.stage_order) ? 'available' : 'locked';
    }
    if (progress.status === 'completed') {
      // If the next stage is accessible, treat as 'passed'
      const nextStageOrder = stage.stage_order + 1;
      if (isStageAccessible(nextStageOrder)) {
      return 'passed';
      }
      return progress.passed ? 'passed' : 'failed';
    }
    return 'in_progress';
  };

  return (
    <div className="container mx-auto max-w-4xl">
      {/* Back button */}
      <Link
        to="/exams"
        className="mb-4 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ChevronLeft size={16} className="mr-1" />
        Back to Exams
      </Link>

      {/* Exam header */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{exam.name}</h1>
        <p className="mt-2 text-gray-600">{exam.description}</p>

        {/* Overall progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-primary-600">{calculateOverallProgress()}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-primary-500"
              style={{ width: `${calculateOverallProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Exam Stages</h2>

        <div className="space-y-4">
          {exam.stages
            .sort((a, b) => a.stage_order - b.stage_order)
            .map((stage, index) => {
              const status = getStageStatus(stage);

              return (
                <motion.div
                  key={stage.stage_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative overflow-hidden rounded-lg border bg-white shadow-sm"
                >
                  {/* Stage connector line */}
                  {index < exam.stages.length - 1 && (
                    <div className="absolute bottom-0 left-8 top-full z-10 w-0.5 bg-gray-200"></div>
                  )}

                  <div className="flex items-start p-4 md:p-6">
                    {/* Status icon */}
                    <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-200 bg-white">
                      {status === 'passed' ? (
                        <CheckCircle size={24} className="text-success-500" />
                      ) : status === 'failed' ? (
                        <XCircle size={24} className="text-error-500" />
                      ) : status === 'locked' ? (
                        <LockClosed size={20} className="text-gray-400" />
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-primary-500"></div>
                      )}
                    </div>

                    {/* Stage info */}
                    <div className="flex-1">
                      <div className="flex flex-col justify-between md:flex-row md:items-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Stage {stage.stage_order}: {stage.name}
                        </h3>
                        <div className="mt-2 flex items-center md:mt-0">
                          <Clock size={16} className="mr-1 text-gray-500" />
                          <span className="text-sm text-gray-500">{stage.time_limit} minutes</span>
                        </div>
                      </div>

                      <p className="mt-1 text-sm text-gray-600">{stage.description}</p>

                      {/* Stage status and action button */}
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          {status === 'passed' && (
                            <span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-800">
                              <Award size={12} className="mr-1" />
                              Passed
                            </span>
                          )}

                          {status === 'failed' && (
                            <span className="inline-flex items-center rounded-full bg-error-100 px-2.5 py-0.5 text-xs font-medium text-error-800">
                              <XCircle size={12} className="mr-1" />
                              Failed
                            </span>
                          )}

                          {status === 'in_progress' && (
                            <span className="inline-flex items-center rounded-full bg-warning-100 px-2.5 py-0.5 text-xs font-medium text-warning-800">
                              In Progress
                            </span>
                          )}

                          {status === 'locked' && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                              <LockClosed size={12} className="mr-1" />
                              Locked
                            </span>
                          )}
                        </div>

                        {status !== 'locked' && (
                          <Link
                            to={`/exams/${examId}/stage/${stage.stage_id}`}
                            className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium ${
                              status === 'passed'
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-primary-600 text-white hover:bg-primary-700'
                            }`}
                          >
                            {status === 'passed' ? 'Review' : <><Play size={16} className="mr-1" /> Start</>}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;