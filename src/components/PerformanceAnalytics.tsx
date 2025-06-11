import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Users,
  BookOpen,
  Award,
  AlertCircle
} from 'lucide-react';
import { PerformanceMetrics, Student } from '../types/assessment';

interface PerformanceAnalyticsProps {
  studentMetrics: PerformanceMetrics[];
  students: Student[];
  examId: string;
}

const PerformanceAnalytics = ({ studentMetrics, students, examId }: PerformanceAnalyticsProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'score' | 'time' | 'category'>('score');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'time'>('score');

  // Calculate overall statistics
  const overallStats = {
    totalStudents: studentMetrics.length,
    averageScore: studentMetrics.reduce((sum, m) => sum + m.percentage, 0) / studentMetrics.length,
    passRate: (studentMetrics.filter(m => m.percentage >= 70).length / studentMetrics.length) * 100,
    averageTime: studentMetrics.reduce((sum, m) => sum + m.timeSpent, 0) / studentMetrics.length
  };

  // Get category performance across all students
  const categoryStats = () => {
    const categories: { [key: string]: { total: number; correct: number; students: number } } = {};
    
    studentMetrics.forEach(metric => {
      Object.entries(metric.categoryPerformance).forEach(([category, performance]) => {
        if (!categories[category]) {
          categories[category] = { total: 0, correct: 0, students: 0 };
        }
        categories[category].total += performance.total;
        categories[category].correct += performance.correct;
        categories[category].students += 1;
      });
    });

    return Object.entries(categories).map(([category, stats]) => ({
      category,
      percentage: (stats.correct / stats.total) * 100,
      totalQuestions: stats.total,
      correctAnswers: stats.correct,
      studentCount: stats.students
    }));
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStudentName = (studentId: string) => {
    return students.find(s => s.id === studentId)?.name || 'Unknown Student';
  };

  const sortedMetrics = [...studentMetrics].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return getStudentName(a.studentId).localeCompare(getStudentName(b.studentId));
      case 'score':
        return b.percentage - a.percentage;
      case 'time':
        return a.timeSpent - b.timeSpent;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <Users size={24} className="mr-3 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.totalStudents}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <BarChart3 size={24} className="mr-3 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.averageScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <Award size={24} className="mr-3 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Pass Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.passRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <Clock size={24} className="mr-3 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Avg. Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(overallStats.averageTime)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Performance */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Performance by Category</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoryStats().map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-gray-200 p-4"
            >
              <h4 className="font-medium text-gray-900 capitalize">{category.category}</h4>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {category.correctAnswers} / {category.totalQuestions} correct
                  </span>
                  <span className="font-medium text-gray-900">
                    {category.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full ${
                      category.percentage >= 70 ? 'bg-green-500' : 
                      category.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {category.studentCount} students attempted
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Student Performance Table */}
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Individual Student Performance</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'score' | 'time')}
              className="rounded border border-gray-300 px-3 py-1 text-sm"
            >
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
              <option value="time">Sort by Time</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Correct Answers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Time Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedMetrics.map((metric, index) => (
                <motion.tr
                  key={metric.studentId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        {getStudentName(metric.studentId).charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {getStudentName(metric.studentId)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {metric.percentage.toFixed(1)}%
                      </span>
                      <div className="ml-2 h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${
                            metric.percentage >= 70 ? 'bg-green-500' : 
                            metric.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${metric.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {metric.questionsCorrect} / {metric.totalQuestions}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {formatTime(metric.timeSpent)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {metric.percentage >= 70 ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <Award size={12} className="mr-1" />
                        Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        <AlertCircle size={12} className="mr-1" />
                        Failed
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;