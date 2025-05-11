import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../api/users';
import { User } from '../types/types';
import { LoadingScreen } from './LoadingScreen'; // Reuse your loading component

export const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const verifyAuth = async () => {
      try {
        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
      } catch (err) {
        console.error('Authentication failed:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};