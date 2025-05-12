export interface User {
  id: number; // 👈 тип должен быть number
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
  name: string;       
  email: string;  
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

export interface UserCategoriesStatsRequest {
  userId: number;
  categoryIds: number[] | string;
}

export interface UserCategoriesStatsResponse {
  user_id: number;
  total_amount: number;
  transaction_count: number;
  categories: CategoryStatistics[];
}

export interface MonthlyStatistics {
  user_id: number;
  total_transactions: number;
  total_amount: number;
  months: MonthStatistics[];
}

export interface MonthStatistics {
  month: string; // Формат "YYYY-MM"
  total_amount: number;
  transaction_count: number;
  average_amount: number;
  categories: CategoryStatistics[];
  transactions?: Transaction[]; // Опционально, если нужны детали транзакций
}