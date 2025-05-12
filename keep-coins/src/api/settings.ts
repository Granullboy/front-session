import axios from 'axios';
import type { UserSettings } from '../types/types';

const API_URL = 'http://localhost:3000/settings';

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

// Default settings can be used as fallback
export const defaultSettings: UserSettings = {
  user_id: -1,
  currency: 'KZT',
  language: 'en',
  theme: 'dark'
};