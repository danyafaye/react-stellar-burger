import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import styles from './app-header.module.css';

export const AppHeader = () => {
  const location = useLocation();

  const checkIsActive = (path: string, include?: boolean) => {
    if (include) {
      return location.pathname.includes(path);
    }
    return location.pathname === path;
  };

  const setIsActiveLink = (path: string, include?: boolean) => {
    return checkIsActive(path, include) ? styles.link_active : '';
  };

  const setIsActiveIcon = (path: string, include?: boolean) => {
    return checkIsActive(path, include) ? 'primary' : 'secondary';
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link to="/" className={`${styles.link} ${setIsActiveLink('/')}`}>
            <BurgerIcon type={setIsActiveIcon('/')} />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </Link>
          <Link
            to="/feed"
            className={`${styles.link} ml-10 ${setIsActiveLink('/feed')}`}
          >
            <ListIcon type={setIsActiveIcon('/feed')} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>
        <Link
          to="/profile"
          className={`${styles.link} ${styles.link_position_last} ${setIsActiveLink('/profile', true)}`}
        >
          <ProfileIcon type={setIsActiveIcon('/profile', true)} />
          <p className="text text_type_main-default ml-2">Личный кабинет</p>
        </Link>
      </nav>
    </header>
  );
};
