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
    // Запрашиваем данные пользователя, если есть токен, но user ещё не загружен
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user]);

  // Пока идёт загрузка пользователя при наличии токена
  if (token && !user && loading) {
    return <LoadingScreen />;
  }

  // Если токена нет или пользователь не авторизован после загрузки
  if (!token || (!user && !loading)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Пользователь авторизован — отображаем защищённый маршрут
  return <Outlet />;
};
