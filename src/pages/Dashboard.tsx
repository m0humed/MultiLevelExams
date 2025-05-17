import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'instructor') {
      navigate('/instructor/dashboard');
    } else {
      navigate('/exams');
    }
  }, [user, navigate]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
    </div>
  );
};

export default Dashboard;