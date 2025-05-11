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
      <nav className="flex gap-4 justify-end items-center p-4 bg-gray-100 dark:bg-gray-800 shadow-md">
        <button 
          className="cursor-pointer text-black dark:text-white font-bold text-xl"
          onClick={() => navigate('/')}
        >
          Keep Coins
        </button>

        {currentUser ? (
          <>
            <span className="text-black dark:text-white">
              Welcome, {currentUser.name}!
            </span>
            <button 
              className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition"
              onClick={() => navigate('/logout')}
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition"
            onClick={() => navigate('/logout')}
          >
            Login
          </button>
        )}

        <button 
          className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition text-2xl ml-2"
          onClick={toggleTheme}
          title="Toggle Theme"
        >
          {themeName === 'dark' ? '🌙' : '☀️'}
        </button>
      </nav>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};