import axios from 'axios';
import type { UserSettings } from '../types/types';

const API_URL = 'http://localhost:3000/settings';
const USERS_API_URL = 'http://localhost:3000/users';

export const getUserSettings = async (userId: number): Promise<UserSettings> => {
  const res = await axios.get(`${API_URL}/user/${userId}`);
  return res.data;
};

export const updateUserSettings = async (
  userId: number, 
  settings: Partial<UserSettings>
): Promise<UserSettings> => {
  const res = await axios.put(`${API_URL}/update/${userId}`, settings);
  return res.data;
};

export const verifyPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    const res = await axios.post(`${USERS_API_URL}/verify-password`, { email, password });
    return res.data.valid;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
};

// Default settings can be used as fallback
export const defaultSettings: UserSettings = {
  user_id: -1,
  name: '',
  email: '',
  currency: 'KZT',
  language: 'en',
  theme: 'dark',
};
