import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserStatistics, CombinedCategoryStatistics } from '../../types/types';
import axios from 'axios';

const API_URL = 'http://localhost:3000/statistics';

export const fetchUserStatistics = createAsyncThunk(
  'statistics/fetchUserStatistics',
  async (userId: number) => {
    const response = await axios.get<UserStatistics>(`${API_URL}/user/${userId}`);
    return response.data;
  }
);

export const fetchCategoryStatistics = createAsyncThunk(
  'statistics/fetchCategoryStatistics',
  async (categoryIds: number | number[]) => {
    const ids = Array.isArray(categoryIds) ? categoryIds.join(',') : categoryIds;
    const response = await axios.get<CombinedCategoryStatistics>(`${API_URL}/category/${ids}`);
    return response.data;
  }
);

interface StatisticsState {
  userStats: UserStatistics | null;
  categoryStats: CombinedCategoryStatistics | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  userStats: null,
  categoryStats: null,
  loading: false,
  error: null,
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearCategoryStats: (state) => {
      state.categoryStats = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // User Statistics
      .addCase(fetchUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user statistics';
      })
      
      // Category Statistics
      .addCase(fetchCategoryStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryStats = action.payload;
      })
      .addCase(fetchCategoryStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch category statistics';
      });
  },
});

export const { clearCategoryStats } = statisticsSlice.actions;
export default statisticsSlice.reducer;