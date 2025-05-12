import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Transaction } from '../../types/types';
import axios from 'axios';
import { deleteTransaction, updateTransaction } from '../../api/transactions';

const API_URL = 'http://localhost:3000/transactions';

export const fetchTransactions = createAsyncThunk('transactions/fetchAll', async () => {
  const response = await axios.get<Transaction[]>(API_URL);
  return response.data;
});

export const removeTransaction = createAsyncThunk(
  'transactions/delete',
  async (id: number) => {
    await deleteTransaction(id);
    return id;
  }
);

export const editTransaction = createAsyncThunk(
  'transactions/edit',
  async ({ id, data }: { id: number; data: Partial<Transaction> }) => {
    const updated = await updateTransaction(id, data);
    return updated;
  }
);

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
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default transactionSlice.reducer;
