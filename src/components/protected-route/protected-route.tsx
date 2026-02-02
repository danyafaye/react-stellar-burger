import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useAuth } from '@providers/auth/AuthContext.ts';
import { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import type { ReactNode } from 'react';
import type React from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  redirectTo?: string;
  authRoute?: boolean;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
  authRoute,
}) => {
  const { isAuthenticated, isAuthChecked } = useAuth();
  const location = useLocation();

  const shouldRedirect = useMemo(
    () => (authRoute ? isAuthenticated : !isAuthenticated),
    [authRoute, isAuthenticated]
  );

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (shouldRedirect) {
    if (authRoute) {
      const from = (location.state as { from?: { pathname?: string } } | null)?.from;
      const target = from?.pathname ?? redirectTo;
      return <Navigate to={target} replace />;
    }

    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
