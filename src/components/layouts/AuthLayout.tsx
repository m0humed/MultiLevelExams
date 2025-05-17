import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  const { user, isLoading } = useAuth();

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  // If user is already logged in, redirect
  if (user) {
    if (user.role === 'instructor') {
      return <Navigate to="/instructor/dashboard" replace />;
    }
    return <Navigate to="/exams" replace />;
  }

  // Render auth layout
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      {/* Left side - Branding */}
      <div className="relative hidden bg-primary-600 md:flex md:w-1/2 md:flex-col md:items-center md:justify-center">
        <div className="px-8 py-12 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <GraduationCap size={50} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-4xl font-bold"
          >
            ExamStage
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 text-xl"
          >
            Multi-stage exam management made easy
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-lg"
          >
            <p>Create sequential exams with multiple stages</p>
            <p className="mt-2">Track student progress through each stage</p>
            <p className="mt-2">Ensure mastery before advancement</p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="0.1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:hidden">
            <GraduationCap size={40} className="mx-auto text-primary-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">ExamStage</h1>
            <p className="text-gray-600">Multi-stage exam management</p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg bg-white p-6 shadow-md md:p-8"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;