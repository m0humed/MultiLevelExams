import { useState, useEffect } from 'react';
import { getStudentsForInstructor, mockStudentProgress } from '../../data/mockData';
import { User } from '../../context/AuthContext';
import { Users, Search, Mail, CheckCircle, Filter, ArrowDown, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Students = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'email' | 'progress'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // Get students
    const allStudents = getStudentsForInstructor();
    setStudents(allStudents);
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  // Calculate progress for a student
  const calculateStudentProgress = (studentId: string) => {
    const studentProgress = mockStudentProgress.filter(
      progress => progress.studentId === studentId
    );
    
    if (studentProgress.length === 0) return 0;
    
    const completedStages = studentProgress.filter(p => p.completed && p.passed).length;
    return Math.round((completedStages / studentProgress.length) * 100);
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: 'name' | 'email' | 'progress') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort and filter students
  const getSortedAndFilteredStudents = () => {
    let filteredStudents = students;
    
    // Apply search filter
    if (searchTerm) {
      filteredStudents = students.filter(
        student =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    return [...filteredStudents].sort((a, b) => {
      let compareResult = 0;
      
      if (sortField === 'name') {
        compareResult = a.name.localeCompare(b.name);
      } else if (sortField === 'email') {
        compareResult = a.email.localeCompare(b.email);
      } else if (sortField === 'progress') {
        const progressA = calculateStudentProgress(a.id);
        const progressB = calculateStudentProgress(b.id);
        compareResult = progressA - progressB;
      }
      
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  };

  const sortedAndFilteredStudents = getSortedAndFilteredStudents();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Students</h1>
        <p className="mt-2 text-gray-600">Manage and view all students</p>
      </div>
      
      {/* Search and filter */}
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative max-w-md">
          <div className="flex items-center">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        
        <div>
          <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>
      </div>
      
      {/* Students table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  <button
                    className="inline-flex items-center"
                    onClick={() => handleSort('name')}
                  >
                    Student
                    {sortField === 'name' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )}
                      </span>
                    )}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  <button
                    className="inline-flex items-center"
                    onClick={() => handleSort('email')}
                  >
                    Email
                    {sortField === 'email' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )}
                      </span>
                    )}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  <button
                    className="inline-flex items-center"
                    onClick={() => handleSort('progress')}
                  >
                    Progress
                    {sortField === 'progress' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )}
                      </span>
                    )}
                  </button>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedAndFilteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                sortedAndFilteredStudents.map((student, index) => {
                  const progressPercent = calculateStudentProgress(student.id);
                  
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                            <Users size={16} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">{student.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="w-full max-w-xs">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-700">{progressPercent}% Complete</span>
                          </div>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full rounded-full ${
                                progressPercent >= 70
                                  ? 'bg-success-500'
                                  : progressPercent >= 30
                                  ? 'bg-warning-500'
                                  : 'bg-primary-500'
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button className="mr-3 inline-flex items-center text-gray-600 hover:text-gray-900">
                          <Mail size={16} className="mr-1" />
                          Message
                        </button>
                        <button className="inline-flex items-center text-primary-600 hover:text-primary-900">
                          <CheckCircle size={16} className="mr-1" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;