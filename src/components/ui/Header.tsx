import { useAuth } from '../../context/AuthContext';
import { Bell, Menu, Search, User } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <header className="z-10 flex h-16 items-center bg-white px-4 shadow md:px-6">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Search */}
      <div className="relative mr-4 hidden flex-1 md:block">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-md rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Notifications */}
        {/* <button className="relative rounded-full p-1 text-gray-700 hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
            3
          </span>
        </button> */}

        {/* User menu */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <User size={16} />
            </div>
            <span className="hidden text-sm font-medium md:block">{user?.name}</span>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              {/* <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a> */}
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;