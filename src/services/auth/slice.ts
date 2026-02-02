import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { apiRequest, fetchWithRefresh } from '@services/rest';
import { setCookie, deleteCookie, getCookie } from '@utils/cookie.ts';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TServerResponse } from '@services/rest';

export type TUser = {
  email: string;
  name: string;
};

export type TAuthResponse = TServerResponse<{
  user: TUser;
  accessToken: string;
  refreshToken: string;
}>;

export type TUserResponse = TServerResponse<{
  user: TUser;
}>;

export type TLoginData = Pick<TUser, 'email'> & { password: string };
export type TRegisterData = TUser & { password: string };

export type TResetPassData = {
  password: string;
  token: string;
};

export type AuthState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  loginIsLoading: boolean;
  registerIsLoading: boolean;
  getUserIsLoading: boolean;
  updateUserIsLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loginIsLoading: false,
  registerIsLoading: false,
  getUserIsLoading: false,
  updateUserIsLoading: false,
};

export const loginUser = createAsyncThunk('auth/login', async (data: TLoginData) => {
  const res = await apiRequest<TAuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  setCookie('accessToken', res.accessToken);
  localStorage.setItem('refreshToken', res.refreshToken);
  return res.user;
});

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => {
    const res = await apiRequest<TAuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const getUser = createAsyncThunk('auth/getUser', async () => {
  const res = await fetchWithRefresh<TUserResponse>('/auth/user', {
    method: 'GET',
    headers: { authorization: getCookie('accessToken') ?? '' },
  });
  return res.user;
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TRegisterData>) => {
    const res = await fetchWithRefresh<TUserResponse>('/auth/user', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { authorization: getCookie('accessToken') ?? '' },
    });
    return res.user;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await apiRequest<TServerResponse<{ message: string }>>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  });
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: { email: string }) => {
    await apiRequest<TServerResponse<{ message: string }>>('/password-reset', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: TResetPassData) => {
    await apiRequest<TServerResponse<{ message: string }>>('/password-reset/reset', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginIsLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loginIsLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loginIsLoading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerIsLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.registerIsLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.registerIsLoading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserIsLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.updateUserIsLoading = false;
      })
      .addCase(updateUser.rejected, (state) => {
        state.updateUserIsLoading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.getUserIsLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.getUserIsLoading = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.getUserIsLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setIsAuthChecked, setUser } = authSlice.actions;
export default authSlice.reducer;
