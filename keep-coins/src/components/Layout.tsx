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
      className="px-4 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      onClick={() => navigate('/')}
      >
      <h3 className="text-xl font-bold">Keep Coins</h3>
      </button>

    {currentUser ? (
      <>
        <span className="text-black dark:text-white">
          Welcome, {currentUser.name}!
        </span>
        <button 
          className="px-4 py-2 bg-gray-100 text-black dark:bg-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
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
  </nav>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};