import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserSettings } from '../../types/types';
import axios from 'axios';

const API_URL = 'http://localhost:3000/settings';

export const fetchUserSettings = createAsyncThunk(
  'settings/fetchUserSettings',
  async (userId: number) => {
    const response = await axios.get<UserSettings>(`${API_URL}/user/${userId}`);
    return response.data;
  }
);

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async ({ userId, settings }: { userId: number; settings: Partial<UserSettings> }) => {
    const response = await axios.put<UserSettings>(`${API_URL}/update/${userId}`, settings);
    return response.data;
  }
);

interface SettingsState {
  currentSettings: UserSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  currentSettings: null,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchUserSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSettings = action.payload;
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch settings';
      })
      
      // Update Settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSettings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update settings';
      });
  },
});

export default settingsSlice.reducer;