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

export interface UserSettings {
  id?: number;
  user_id: number;
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
}

export interface UserStatistics {
  user_id: number;
  balance: number;
  total_income: number;
  total_expenses: number;
  transaction_count: number;
  category_stats: CategorySummary[];
  recent_transactions: Transaction[];
}

export interface CategorySummary {
  category_id: number;
  category_name: string;
  total: number;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  transaction_count: number;
}

export interface CombinedCategoryStatistics {
  total_amount: number;
  transaction_count: number;
  categories: CategoryStatistics[];
}

export interface CategoryStatistics extends CategorySummary {
  average_amount: number;
  transactions: Transaction[];
}