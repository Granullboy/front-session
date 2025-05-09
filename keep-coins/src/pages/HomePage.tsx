import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/types';
import { getCurrentUser } from '../api/users';

export const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            navigate('/login');
            return;
        }
  
    const fetchData = async () => {
      try {
        const user = await getCurrentUser(token);
        if (!user) {
          navigate('/login')
          console.log('User not found')
        }
        setCurrentUser(user);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [navigate]);

  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  
  return (
    <div>
        <h2 className="text-2xl font-bold text-center mb-6">
            Work in prorgess
        </h2>   
    </div>
  )
}