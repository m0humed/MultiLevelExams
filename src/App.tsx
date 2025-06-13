import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ExamList from './pages/student/ExamList';
import ExamDetails from './pages/student/ExamDetails';
import StageExam from './pages/student/StageExam';
import ReviewExam from './pages/student/ReviewExam';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import ExamCreate from './pages/instructor/ExamCreate';
import ExamEdit from './pages/instructor/ExamEdit';
import Students from './pages/instructor/Students';
import NotFound from './pages/NotFound';

function App() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        
        {/* Student routes */}
        {user?.role === 'student' && (
          <>
            <Route path="/exams" element={<ExamList />} />
            <Route path="/exams/:examId" element={<ExamDetails />} />
            <Route path="/exams/:examId/stage/:stageId" element={<StageExam />} />
            <Route path="/exams/:examId/stage/:stageId/review" element={<ReviewExam />} />
          </>
        )}
        
        {/* Instructor routes */}
        {user?.role === 'instructor' && (
          <>
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/exams/create" element={<ExamCreate />} />
            <Route path="/instructor/exams/:examId/edit" element={<ExamEdit />} />
            <Route path="/instructor/students" element={<Students />} />
          </>
        )}
        
        {/* Catch all route */}
        <Route path="/404" element={<NotFound />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;