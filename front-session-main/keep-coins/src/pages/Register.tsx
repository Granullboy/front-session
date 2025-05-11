import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, setAuthToken } from '../api/users';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let response = await registerUser(name, email, password);
      

      if ('token' in response) {
        setAuthToken(response.token);
        navigate('/');
      } else {
        setError(response.message || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-200 rounded-lg shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        Register
      </h2>
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
      </form>
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="mt-4 text-blue-600 hover:underline text-sm w-full text-center"
      >
        Already have an account? Login
      </button>
    </div>
  );
};