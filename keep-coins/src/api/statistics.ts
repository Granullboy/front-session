import axios from 'axios';
import type { 
  UserStatistics, 
  CategoryStatistics,
  CombinedCategoryStatistics 
} from '../types/types';

const API_URL = 'http://localhost:3000/statistics';

export const getUserStatistics = async (userId: number): Promise<UserStatistics> => {
  const res = await axios.get(`${API_URL}/user/${userId}`);
  return res.data;
};

export const getCategoryStatistics = async (
  categoryIds: number | number[]
): Promise<CombinedCategoryStatistics> => {
  // Handle single ID or array of IDs
  const ids = Array.isArray(categoryIds) 
    ? categoryIds.join(',') 
    : categoryIds.toString();
  
  const res = await axios.get(`${API_URL}/category/${ids}`);
  return res.data;
};

// Helper to get statistics for all categories of a user
export const getUserCategoryStatistics = async (
  userId: number
): Promise<CategoryStatistics[]> => {
  // First get user statistics which includes category summaries
  const userStats = await getUserStatistics(userId);
  
  // Then get detailed stats for each category
  const categoryIds = userStats.category_stats.map(c => c.category_id);
  if (categoryIds.length === 0) return [];
  
  const detailedStats = await getCategoryStatistics(categoryIds);
  return detailedStats.categories;
};