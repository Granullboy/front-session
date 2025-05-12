import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserSettings } from '../../types/types';
import axios from 'axios';

const API_URL = 'http://localhost:3000/settings';
const USERS_API_URL = 'http://localhost:3000/users';

// Separate update types
type SecureUpdate = {
  userId: number;
  settings: Partial<UserSettings>;
  password: string;
};

type RegularUpdate = {
  userId: number;
  settings: Partial<UserSettings>;
};

export const fetchUserSettings = createAsyncThunk(
  'settings/fetchUserSettings',
  async (userId: number) => {
    const response = await axios.get<UserSettings>(`${API_URL}/user/${userId}`);
    return response.data;
  }
);

export const verifyPassword = createAsyncThunk(
  'settings/verifyPassword',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ valid: boolean }>(
        `${USERS_API_URL}/verify-password`, 
        { email, password }
      );
      return response.data.valid;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to verify password');
    }
  }
);

export const updateSecureSettings = createAsyncThunk(
  'settings/updateSecureSettings',
  async ({ userId, settings, password }: SecureUpdate, { rejectWithValue }) => {
    try {
      // Verify password first
      const verifyResponse = await axios.post<{ valid: boolean }>(
        `${USERS_API_URL}/verify-password`,
        { email: settings.email, password }
      );

      if (!verifyResponse.data.valid) {
        return rejectWithValue('Invalid password');
      }

      // Then update settings
      const response = await axios.put<UserSettings>(
        `${API_URL}/update/${userId}`,
        settings
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update settings');
    }
  }
);

export const updateRegularSettings = createAsyncThunk(
  'settings/updateRegularSettings',
  async ({ userId, settings }: RegularUpdate, { rejectWithValue }) => {
    try {
      const response = await axios.put<UserSettings>(
        `${API_URL}/update/${userId}`,
        settings
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update settings');
    }
  }
);

interface SettingsState {
  currentSettings: UserSettings | null;
  loading: boolean;
  error: string | null;
  passwordVerified: boolean;
}

const initialState: SettingsState = {
  currentSettings: null,
  loading: false,
  error: null,
  passwordVerified: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearPasswordVerification: (state) => {
      state.passwordVerified = false;
    },
    clearSettingsError: (state) => {
      state.error = null;
    },
  },
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
      
      // Verify Password
      .addCase(verifyPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordVerified = action.payload;
        if (!action.payload) {
          state.error = 'Invalid password';
        }
      })
      .addCase(verifyPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to verify password';
      })
      
      // Update Secure Settings
      .addCase(updateSecureSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSecureSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSettings = action.payload;
        state.passwordVerified = false;
      })
      .addCase(updateSecureSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update settings';
      })
      
      // Update Regular Settings
      .addCase(updateRegularSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRegularSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSettings = action.payload;
      })
      .addCase(updateRegularSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update settings';
      });
  },
});

export const { clearPasswordVerification, clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;