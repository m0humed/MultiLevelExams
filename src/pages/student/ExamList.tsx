import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, ChevronRight, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

type Exam = {
  id: string;           // exam_id from DB
  name: string;         // name from DB
  description: string;  // description from DB
  number_of_stages: number;
  total_time_minutes: number; // total_time_minutes from DB
};

type ProgressSession = {
  id: string;
  exam_id: string;
  stageId: string;
  completed: boolean;
  passed: boolean;
};

type ProgressMap = {
  [examId: string]: ProgressSession[];
};

const ExamList = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);

      fetch(`https://multilevelexambackend-production.up.railway.app/api/exams/exams?studentId=` + user.id)
        .then(res => res.json())
        .then((data) => {
          setExams(
            data.map((exam: any) => ({
              id: exam.exam_id,
              name: exam.name,
              description: exam.description,
              number_of_stages: Number(exam.stage_count),
              total_time_minutes: Number(exam.total_time_minutes),
            }))
          );
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetch(`https://multilevelexambackend-production.up.railway.app/api/exams/progress/${user.id}`)
        .then(res => res.json())
        .then(data => {
          const progressData: ProgressMap = {};
          data.forEach((session: any) => {
            const examId = String(session.exam_id);
            const progressSession: ProgressSession = {
              id: String(session.session_id),
              exam_id: String(session.exam_id),
              stageId: String(session.stage_id),
              completed: Boolean(session.completed),
              passed: Boolean(session.passed),
            };
            if (!progressData[examId]) progressData[examId] = [];
            progressData[examId].push(progressSession);
          });
          setProgress(progressData);
        });
    }
  }, [user]);

  const calculateProgress = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return 0;

    const totalStages = exam.number_of_stages;
    if (!totalStages || !progress[examId] || progress[examId].length === 0) return 0;

    const completedStages = progress[examId]?.filter(p => p.completed && p.passed).length || 0;

    return Math.round((completedStages / totalStages) * 100);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">My Exams</h1>
        <p className="mt-2 text-gray-600">Complete each stage to unlock the next one</p>
      </div>
      
      {exams.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <BookOpen size={40} className="mx-auto text-gray-400" />
          <p className="mt-4 text-gray-600">No exams available yet</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam, index) => {
            console.log(`Exam ID: ${exam.id}, Stages: ${exam.number_of_stages}, Progress: ${calculateProgress(exam.id)}`);
            const hasStages = exam.number_of_stages > 0;
            const progressPercent = hasStages ? calculateProgress(exam.id) : 0;

            return (
                <motion.div
                key={`exam-motion-${exam.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                <Link
                  to={hasStages ? `/exams/${exam.id}` : "#"}
                  className={`block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md ${!hasStages ? "pointer-events-none opacity-60" : ""}`}
                  tabIndex={hasStages ? 0 : -1}
                  aria-disabled={!hasStages}
                >
                  <div className="bg-primary-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOpen size={18} className="mr-2 text-primary-600" />
                        <span className="font-medium text-primary-700">
                          {hasStages ? `${exam.number_of_stages} ${exam.number_of_stages === 1 ? 'Stage' : 'Stages'}` : 'No Stages'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {hasStages ? exam.total_time_minutes : 0} min
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{exam.name}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{exam.description}</p>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-700">Progress</span>
                        <span className="font-medium text-primary-600">{progressPercent}%</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-primary-500"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Next stage or no stages message */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        {!hasStages ? (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                            No stages available
                          </span>
                        ) : progressPercent === 100 ? (
                          <span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-800">
                            <Award size={12} className="mr-1" />
                            Completed
                          </span>
                        ) : (
                          <span className="text-sm text-gray-700">
                            In Progress
                          </span>
                        )}
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExamList;