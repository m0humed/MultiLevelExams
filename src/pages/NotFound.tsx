import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="animate-bounce text-error-500">
        <AlertCircle size={60} />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">404 - Page Not Found</h1>
      <p className="mt-2 text-center text-gray-600">
        The page you're looking for doesn't exist or you don't have permission to view it.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
      >
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;