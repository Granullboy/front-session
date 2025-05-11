import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/users';
import type { User } from '../types/types';
import { useEffect, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

export const Layout = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toggleTheme, themeName } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser(token).then(setCurrentUser);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black dark:bg-slate-900 dark:text-white transition-colors duration-300">
      <nav className="flex items-center justify-between p-4 bg-gray-900">
        <button 
          className="cursor-pointer ml-4 md:ml-6"
          onClick={() => navigate('/')}
        >
          <h3 className="text-2xl font-bold">Keep Coins</h3>
        </button>
        <div className="flex items-center gap-4 mr-4">{/*обнавляю стиль у layout*/ }
          {currentUser ? (
            <>
              <button className="text-white bg-transparent border-none " onClick={() => navigate('/dashboard')}>Dashboard</button>
              <button className="text-white bg-transparent border-none " onClick={() => navigate('/stats')}>Statistics</button>
              <button className="text-white bg-transparent border-none " onClick={() => navigate('/settings')}>Settings</button>
              <button 
                className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
                onClick={() => navigate('/logout')}
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              className="px-4 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              onClick={() => navigate('/logout')}
              >
              Login
              </button>
          )}

      <button 
        className="px-4 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition text-2xl"
        onClick={toggleTheme}
        title="Toggle Theme"
      >
        {themeName === 'dark' ? '🌙' : '☀️'}
      </button>
    </div>
  </nav>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};