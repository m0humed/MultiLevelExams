import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getExamsCreatedByInstructor,
  getStudentsForInstructor,
  mockStudentProgress,
  Exam,
} from '../../data/mockData';
import {
  Users,
  BookOpen,
  PlusCircle,
  BarChart3,
  ChevronRight,
  FileEdit,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Get exams created by instructor
    const instructorExams = getExamsCreatedByInstructor(user.id);
    setExams(instructorExams);

    // Get students
    const students = getStudentsForInstructor();
    setStudentCount(students.length);

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [user]);

  // Get completion statistics for an exam
  const getExamStats = (examId: string) => {
    const allProgress = mockStudentProgress.filter(p => p.examId === examId);
    const completedStages = allProgress.filter(p => p.completed).length;
    const passedStages = allProgress.filter(p => p.passed).length;

    return {
      totalAttempts: allProgress.length,
      completedStages,
      passedStages,
    };
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Instructor Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your exams and monitor student progress</p>
      </div>

      {/* Stats overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <BookOpen size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{exams.length}</h3>
              <p className="text-sm text-gray-500">Exams Created</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">{studentCount}</h3>
              <p className="text-sm text-gray-500">Students</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-500">
              <BarChart3 size={24} />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {mockStudentProgress.filter(p => p.passed).length}
              </h3>
              <p className="text-sm text-gray-500">Stages Passed</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create exam button */}
      <div className="mb-6">
        <Link
          to="/instructor/exams/create"
          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <PlusCircle size={16} className="mr-2" />
          Create New Exam
        </Link>
      </div>

      {/* Recent exams */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your Exams</h2>
          <Link to="/instructor/exams" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>

        {exams.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
            <BookOpen size={40} className="mx-auto text-gray-400" />
            <p className="mt-4 text-gray-600">You haven't created any exams yet</p>
            <Link
              to="/instructor/exams/create"
              className="mt-4 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              <PlusCircle size={16} className="mr-2" />
              Create First Exam
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam, index) => {
              const stats = getExamStats(exam.id);
              
              return (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                >
                  <div className="border-b border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOpen size={16} className="mr-2 text-primary-600" />
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
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                      <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                        {exam.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">{exam.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-md bg-gray-50 p-2">
                        <p className="text-lg font-medium text-gray-900">{stats.totalAttempts}</p>
                        <p className="text-xs text-gray-500">Attempts</p>
                      </div>
                      <div className="rounded-md bg-gray-50 p-2">
                        <p className="text-lg font-medium text-gray-900">{stats.passedStages}</p>
                        <p className="text-xs text-gray-500">Passed Stages</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <Link
                        to={`/instructor/exams/${exam.id}/edit`}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <FileEdit size={14} className="mr-1" />
                        Edit
                      </Link>
                      
                      <Link
                        to={`/instructor/exams/${exam.id}`}
                        className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        View Details
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent student activity */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Student Activity</h2>
          <Link to="/instructor/students" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            View all students
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Exam
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Stage
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mockStudentProgress.map((progress, index) => {
                  const exam = exams.find(e => e.id === progress.examId);
                  const stage = exam?.stages.find(s => s.id === progress.stageId);
                  
                  return (
                    <tr key={`${progress.studentId}-${progress.stageId}`}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                            <Users size={14} />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Jane Smith</p>
                            <p className="text-xs text-gray-500">student@example.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {exam?.title || 'Unknown Exam'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {stage?.title || 'Unknown Stage'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {progress.completed ? `${progress.score}%` : '-'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {progress.completed ? (
                          progress.passed ? (
                            <span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-800">
                              <CheckCircle size={12} className="mr-1" />
                              Passed
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-error-100 px-2.5 py-0.5 text-xs font-medium text-error-800">
                              Failed
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-warning-100 px-2.5 py-0.5 text-xs font-medium text-warning-800">
                            In Progress
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(progress.startedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;