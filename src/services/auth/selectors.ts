import type { RootState } from '@services/store.ts';

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsAuthChecked = (state: RootState) => state.auth.isAuthChecked;
export const selectLoginIsLoading = (state: RootState) => state.auth.loginIsLoading;
export const selectRegisterIsLoading = (state: RootState) =>
  state.auth.registerIsLoading;
export const selectGetUserIsLoading = (state: RootState) => state.auth.getUserIsLoading;
export const selectUpdateUserIsLoading = (state: RootState) =>
  state.auth.updateUserIsLoading;
