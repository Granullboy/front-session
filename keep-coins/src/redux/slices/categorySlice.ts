import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Category } from '../../types/types';
import axios from 'axios';

const API_URL = 'http://localhost:3000/categories';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  const response = await axios.get<Category[]>(API_URL);
  return response.data;
});

interface CategoryState {
  items: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export default categorySlice.reducer;
