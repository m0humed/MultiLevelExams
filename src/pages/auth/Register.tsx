import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { UserRole } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [formError, setFormError] = useState('');
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset form error
    setFormError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    await register(name, email, password, role);
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Create your account</h2>
      
      {(error || formError) && (
        <div className="mb-4 flex items-center rounded-md bg-error-50 p-3 text-error-800">
          <AlertCircle size={16} className="mr-2 flex-shrink-0" />
          <p className="text-sm">{error || formError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="you@example.com"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
            Account type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="text-primary-600 focus:ring-primary-500"
                name="role"
                value="student"
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              <span className="ml-2 text-sm text-gray-700">Student</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="text-primary-600 focus:ring-primary-500"
                name="role"
                value="instructor"
                checked={role === 'instructor'}
                onChange={() => setRole('instructor')}
              />
              <span className="ml-2 text-sm text-gray-700">Instructor</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full rounded-md bg-primary-600 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;