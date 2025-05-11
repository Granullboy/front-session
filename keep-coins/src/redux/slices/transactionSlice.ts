import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Transaction } from '../../types/types';
import axios from 'axios';

const API_URL = 'http://localhost:3000/transactions';

export const fetchTransactions = createAsyncThunk('transactions/fetchAll', async () => {
  const response = await axios.get<Transaction[]>(API_URL);
  return response.data;
});

interface TransactionState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  items: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      });
  },
});

export default transactionSlice.reducer;
