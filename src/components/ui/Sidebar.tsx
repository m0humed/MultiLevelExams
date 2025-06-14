import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Layout, BookOpen, Users, Settings, Award, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();

  const studentLinks = [
    { path: '/exams', label: 'My Exams', icon: BookOpen },
    //{ path: '/settings', label: 'Settings', icon: Settings },
  ];

  const instructorLinks = [
    { path: '/instructor/dashboard', label: 'Dashboard', icon: Layout },
    { path: '/instructor/exams/create', label: 'Create Exam', icon: BookOpen },
    { path: '/instructor/students', label: 'Students', icon: Users },
    //{ path: '/settings', label: 'Settings', icon: Settings },
  ];

  const links = user?.role === 'instructor' ? instructorLinks : studentLinks;

  const isActiveLink = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          {
            'translate-x-0': isOpen,
            '-translate-x-full': !isOpen,
          }
        )}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={toggleSidebar}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 md:hidden"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap size={28} className="text-primary-600" />
            <span className="text-xl font-bold text-gray-900">ExamStage</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="mb-6">
            <p className="mb-2 px-2 text-xs font-semibold uppercase text-gray-400">
              {user?.role === 'instructor' ? 'Instructor' : 'Student'} Menu
            </p>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={clsx(
                      'flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                      {
                        'bg-primary-50 text-primary-700': isActiveLink(link.path),
                        'text-gray-700 hover:bg-gray-100': !isActiveLink(link.path),
                      }
                    )}
                  >
                    <link.icon
                      size={18}
                      className={clsx('mr-3', {
                        'text-primary-500': isActiveLink(link.path),
                        'text-gray-500': !isActiveLink(link.path),
                      })}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User role label */}
          <div className="mt-auto">
            <div className="rounded-md bg-primary-50 px-4 py-3">
              <div className="flex items-center">
                <Award size={18} className="mr-3 text-primary-500" />
                <div>
                  <p className="text-xs font-semibold text-primary-700">
                    {user?.role === 'instructor' ? 'Instructor' : 'Student'} Account
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;