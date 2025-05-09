import axios from 'axios';
import { User } from '../types/types';

const API_URL = 'http://localhost:3000/users/';

const api = axios.create({
  baseURL: API_URL,
});


export interface AuthResponse {
  user: User;
  token: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string>;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse | ErrorResponse> => {
  try {
    const response = await api.post<AuthResponse>('register', {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ErrorResponse;
    }
    return { message: 'An unexpected error occurred' };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse | ErrorResponse> => {
  try {
    const response = await api.post<AuthResponse>('login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ErrorResponse;
    }
    return { message: 'An unexpected error occurred' };
  }
};

export const getCurrentUser = async (token: string): Promise<User | null> => {
  try {
    const response = await api.get<User>('me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user', error);
    return null;
  }
};

// Add to localStorage and axios headers
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize axios headers from localStorage on app start
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}