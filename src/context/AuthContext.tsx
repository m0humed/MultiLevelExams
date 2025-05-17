import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Types
export type UserRole = 'student' | 'instructor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'John Instructor',
    email: 'instructor@example.com',
    password: 'password',
    role: 'instructor' as UserRole,
  },
  {
    id: '2',
    name: 'Jane Student',
    email: 'student@example.com',
    password: 'password',
    role: 'student' as UserRole,
  },
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Omit password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      // Redirect based on role
      if (foundUser.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/exams');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user (in a real app, this would be an API call)
      const newUser = {
        id: String(mockUsers.length + 1),
        name,
        email,
        role,
      };
      
      // Store user in local storage
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      // Redirect based on role
      if (role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/exams');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};