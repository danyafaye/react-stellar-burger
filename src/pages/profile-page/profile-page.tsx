import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { logoutUser } from '@services/auth/slice.ts';

import styles from './profile-page.module.css';

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveLink = (path: string) => {
    return location.pathname === path ? styles.isActive : '';
  };

  const handleLogout = () => {
    void dispatch(logoutUser());
  };

  return (
    <section className={styles.profile}>
      <div className={styles.navContainer}>
        <nav className={styles.nav}>
          <ul>
            <li
              className={`${styles.link} ${isActiveLink('/profile')} text text_type_main-medium`}
              onClick={() => void navigate('/profile')}
            >
              Профиль
            </li>
            <li
              className={`${styles.link} ${isActiveLink('/profile/orders')} text text_type_main-medium`}
              onClick={() => void navigate('/profile/orders')}
            >
              История заказов
            </li>
            <li
              className={`${styles.link} text text_type_main-medium`}
              onClick={handleLogout}
            >
              Выход
            </li>
          </ul>
        </nav>
        <span className="text text_type_main-default text_color_inactive">
          В этом разделе вы можете изменить свои персональные данные
        </span>
      </div>
      <Outlet />
    </section>
  );
};
