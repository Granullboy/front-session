export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id?: number;
  user_id: number[];
  amount: number;
  type: 'income' | 'expense';
  category_id: number[];
  comment?: string;
  date: string;
}

export interface Category {
  id?: number;
  user_id: number[];
  name: string;
  icon?: string;
  color?: string;
  type: 'income' | 'expense';
  createdAt?: string;
}