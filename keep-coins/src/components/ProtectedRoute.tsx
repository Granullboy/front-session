import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { fetchCurrentUser } from '../redux/slices/authSlice';
import { LoadingScreen } from './LoadingScreen';

export const ProtectedRoute = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, loading, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Запрашиваем данные пользователя только если есть токен, но нет пользователя
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  // Если идет загрузка и есть токен (значит запрос в процессе)
  if (loading && token) {
    return <LoadingScreen />;
  }

  // Если нет пользователя (и загрузка завершена или токена нет)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};