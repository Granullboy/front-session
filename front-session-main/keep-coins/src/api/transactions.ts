import axios from 'axios';
const API_URL = 'http://localhost:3000/transactions';

export interface Transaction {
  id?: number;
  user_id: number[];
  amount: number;
  type: 'income' | 'expense';
  category_id: number[];
  comment?: string;
  date: string;
}

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};

export const getTransactionsByUser = async (userId: number): Promise<Transaction[]> => {
  const res = await axios.get(`${API_URL}/user/${userId}`);
  return res.data;
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const res = await axios.post(`${API_URL}/new-transaction`, transaction);
  return res.data;
};

export const deleteTransaction = async (id: number) => {
  return axios.delete(`${API_URL}/delete/${id}`);
};

export const updateTransaction = async (id: number, transaction: Partial<Transaction>): Promise<Transaction> => {
  const res = await axios.put(`${API_URL}/update/${id}`, transaction);
  return res.data;
};
