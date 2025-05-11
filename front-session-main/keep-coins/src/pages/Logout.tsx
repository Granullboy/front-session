import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
        localStorage.setItem('token', '')
        navigate('/login');
    }, []);

    return (
        <div className="max-w-md mx-auto mt-8 p-6 border border-gray-200 rounded-lg shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-center mb-6">
                Loging out
            </h2>
      </div>
    )
}