import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/users';
import type{ User } from '../types/types';
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
    <div className="min-h-screen flex flex-col ">
      <nav className="flex gap-4 justify-end p-2 bg-gray-900">
      <button 
        className="cursor-pointer p-4"
        onClick={() => navigate('/')}
      >
        <h3 className="text-2xl font-bold">Keep Coins</h3>
      </button>
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
            className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
            onClick={() => navigate('/logout')}
          >
            Login
          </button>
        )}
        <button 
          className="text-white hover:text-gray-300 bg-transparent border-none cursor-pointer"
          onClick={toggleTheme}
        >
          {themeName == "dark" ? '🌙' : '☀️'}
        </button>
      </nav>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};