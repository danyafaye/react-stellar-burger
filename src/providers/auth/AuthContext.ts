import { createContext, useContext } from 'react';

import type { selectUser } from '@services/auth/selectors.ts';

type AuthContext = {
  user: ReturnType<typeof selectUser>;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
