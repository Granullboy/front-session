import axios from 'axios';
import type{ Category } from '../types/types';
const API_URL = 'http://localhost:3000/categories';

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};

export const getCategoriesByUser = async (userId: number): Promise<Category[]> => {
  const res = await axios.get(`${API_URL}/user/${userId}`);
  return res.data;
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const res = await axios.post(`${API_URL}/new-category`, category);
  return res.data;
};

export const deleteCategory = async (id: number) => {
  return axios.delete(`${API_URL}/delete/${id}`);
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  const res = await axios.put(`${API_URL}/update/${id}`, category);
  return res.data;
};
