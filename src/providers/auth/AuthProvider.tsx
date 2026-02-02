import { type FC, type PropsWithChildren, useEffect } from 'react';

import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { useAppSelector } from '@hooks/useAppSelector.ts';
import {
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectUser,
} from '@services/auth/selectors.ts';
import { getUser, setIsAuthChecked, setUser } from '@services/auth/slice.ts';
import { getCookie } from '@utils/cookie.ts';

import { AuthContext } from './AuthContext';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);

  useEffect(() => {
    if (getCookie('accessToken')) {
      void dispatch(getUser()).finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
      dispatch(setUser(null));
    }
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAuthChecked }}>
      {children}
    </AuthContext.Provider>
  );
};
