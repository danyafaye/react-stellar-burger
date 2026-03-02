import { describe, expect, it } from 'vitest';

import reducer, {
  setIsAuthChecked,
  setUser,
  loginUser,
  registerUser,
  updateUser,
  getUser,
  logoutUser,
} from './slice';

const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loginIsLoading: false,
  registerIsLoading: false,
  getUserIsLoading: false,
  updateUserIsLoading: false,
};

const mockUser = {
  email: 'test@test.com',
  name: 'Test User',
};

describe('auth slice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setIsAuthChecked', () => {
    const state = reducer(initialState, setIsAuthChecked(true));
    expect(state.isAuthChecked).toBe(true);
  });

  it('should handle setUser', () => {
    const state = reducer(initialState, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = reducer(initialState, action);
    expect(state.loginIsLoading).toBe(true);
  });

  it('should handle loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser,
    };
    const state = reducer({ ...initialState, loginIsLoading: true }, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loginIsLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('should handle loginUser.rejected', () => {
    const action = { type: loginUser.rejected.type };
    const state = reducer({ ...initialState, loginIsLoading: true }, action);
    expect(state.loginIsLoading).toBe(false);
  });

  it('should handle registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const state = reducer(initialState, action);
    expect(state.registerIsLoading).toBe(true);
  });

  it('should handle registerUser.fulfilled', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: mockUser,
    };
    const state = reducer({ ...initialState, registerIsLoading: true }, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.registerIsLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('should handle updateUser.pending', () => {
    const action = { type: updateUser.pending.type };
    const state = reducer(initialState, action);
    expect(state.updateUserIsLoading).toBe(true);
  });

  it('should handle updateUser.fulfilled', () => {
    const action = {
      type: updateUser.fulfilled.type,
      payload: mockUser,
    };
    const state = reducer({ ...initialState, updateUserIsLoading: true }, action);
    expect(state.user).toEqual(mockUser);
    expect(state.updateUserIsLoading).toBe(false);
  });

  it('should handle getUser.pending', () => {
    const action = { type: getUser.pending.type };
    const state = reducer(initialState, action);
    expect(state.getUserIsLoading).toBe(true);
  });

  it('should handle getUser.fulfilled', () => {
    const action = {
      type: getUser.fulfilled.type,
      payload: mockUser,
    };
    const state = reducer({ ...initialState, getUserIsLoading: true }, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.getUserIsLoading).toBe(false);
  });

  it('should handle getUser.rejected', () => {
    const action = { type: getUser.rejected.type };
    const state = reducer(
      { ...initialState, getUserIsLoading: true, isAuthenticated: true },
      action
    );
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.getUserIsLoading).toBe(false);
  });

  it('should handle logoutUser.fulfilled', () => {
    const action = { type: logoutUser.fulfilled.type };
    const state = reducer(
      { ...initialState, user: mockUser, isAuthenticated: true },
      action
    );
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
