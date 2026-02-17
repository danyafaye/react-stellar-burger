import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import IngredientDetails from '@components/ingredient-details/ingredient-details.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { OrderInfoDetails } from '@components/order-info-details/order-info-details.tsx';
import { ProtectedRoute } from '@components/protected-route/protected-route.tsx';
import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { FeedPage } from '@pages/feed-page/feed-page.tsx';
import { ForgotPassword } from '@pages/forgot-password/forgot-password.tsx';
import { IngredientPage } from '@pages/ingredient-page/ingredient-page.tsx';
import { MainPage } from '@pages/main-page/main-page.tsx';
import { NotFoundPage } from '@pages/not-found-page/not-found-page.tsx';
import { ProfileInfo } from '@pages/profile-info/profile-info.tsx';
import { ProfileOrdersPage } from '@pages/profile-orders-page/profile-orders-page.tsx';
import { ProfilePage } from '@pages/profile-page/profile-page.tsx';
import { ResetPassword } from '@pages/reset-password/reset-password.tsx';
import { SignIn } from '@pages/sign-in/sign-in.tsx';
import { SignUp } from '@pages/sign-up/sign-up.tsx';
import { fetchIngredients } from '@services/ingredients/slice.ts';

import styles from './app.module.css';

export const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as { background?: Location })?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const handleModalClose = () => {
    void navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background ?? location}>
        <Route path="/" element={<MainPage />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="/feed/:id" element={<OrderInfoDetails />} />
        <Route
          path="/profile/orders/:id"
          element={
            <ProtectedRoute>
              <OrderInfoDetails profileOrder />
            </ProtectedRoute>
          }
        />
        <Route path="/feed" element={<FeedPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <ProtectedRoute>
                <ProfileInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <ProfileOrdersPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/login"
          element={
            <ProtectedRoute authRoute redirectTo="/">
              <SignIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute authRoute redirectTo="/">
              <SignUp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute authRoute redirectTo="/">
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <ProtectedRoute authRoute redirectTo="/">
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:id"
            element={
              <Modal onClose={handleModalClose}>
                <OrderInfoDetails isModal />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:id"
            element={
              <ProtectedRoute>
                <Modal onClose={handleModalClose}>
                  <OrderInfoDetails profileOrder isModal />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
