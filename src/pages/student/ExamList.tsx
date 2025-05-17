import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAvailableExams, getStudentProgress, Exam, StudentProgress } from '../../data/mockData';
import { BookOpen, ChevronRight, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const ExamList = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [progress, setProgress] = useState<{ [examId: string]: StudentProgress[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Get available exams
      const availableExams = getAvailableExams(user.id);
      setExams(availableExams);

      // Get progress for each exam
      const progressData: { [examId: string]: StudentProgress[] } = {};
      availableExams.forEach(exam => {
        progressData[exam.id] = getStudentProgress(user.id, exam.id);
      });
      setProgress(progressData);
      
      // Simulate loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Calculate progress percentage for an exam
  const calculateProgress = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return 0;
    
    const totalStages = exam.stages.length;
    const completedStages = progress[examId]?.filter(p => p.completed && p.passed).length || 0;
    
    return Math.round((completedStages / totalStages) * 100);
  };

  // Get the next stage for an exam
  const getNextStage = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (!exam) return null;
    
    // Find the highest completed stage
    const stageProgress = progress[examId] || [];
    const completedStageIds = stageProgress
      .filter(p => p.completed && p.passed)
      .map(p => p.stageId);
    
    // Get the stages ordered by their order property
    const orderedStages = [...exam.stages].sort((a, b) => a.order - b.order);
    
    // Find the first stage that hasn't been completed
    const nextStage = orderedStages.find(stage => !completedStageIds.includes(stage.id));
    
    return nextStage;
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
            const progressPercent = calculateProgress(exam.id);
            const nextStage = getNextStage(exam.id);
            
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={`/exams/${exam.id}`}
                  className="block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="bg-primary-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOpen size={18} className="mr-2 text-primary-600" />
                        <span className="font-medium text-primary-700">
                          {exam.stages.length} {exam.stages.length === 1 ? 'Stage' : 'Stages'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {exam.stages.reduce((total, stage) => total + stage.duration, 0)} min
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
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
                    
                    {/* Next stage */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        {progressPercent === 100 ? (
                          <span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-800">
                            <Award size={12} className="mr-1" />
                            Completed
                          </span>
                        ) : (
                          <span className="text-sm text-gray-700">
                            Next: {nextStage?.title || 'Unknown stage'}
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