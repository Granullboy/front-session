import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, setAuthToken } from '../api/users';

export const Layout = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        getCurrentUser(token).then(setCurrentUser);
      }
    }, []);
  
    const handleLogout = () => {
      localStorage.setItem('token', '')
      setCurrentUser(null);
      navigate('/login');
    };