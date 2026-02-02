import {
  Button,
  EmailInput,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { useAppSelector } from '@hooks/useAppSelector.ts';
import { selectLoginIsLoading } from '@services/auth/selectors.ts';
import { loginUser } from '@services/auth/slice.ts';

import styles from './sign-in.module.css';

type SignInForm = {
  email: string;
  password: string;
};

export const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectLoginIsLoading);
  const [formData, setFormData] = useState<SignInForm>({
    email: '',
    password: '',
  });

  const onChangeField = (value: string, field: keyof SignInForm) =>
    setFormData({ ...formData, [field]: value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void dispatch(loginUser(formData))
      .unwrap()
      .then(() => {
        const from = (location.state as { from?: { pathname?: string } } | null)
          ?.from ?? { pathname: '/' };
        void navigate(from, { replace: true });
      });
  };

  return (
    <section className={styles.container}>
      <h2 className={`${styles.title} text text_type_main-medium`}>Вход</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <EmailInput
          disabled={isLoading}
          onChange={(e) => onChangeField(e.target.value, 'email')}
          value={formData.email}
        />
        <PasswordInput
          disabled={isLoading}
          value={formData.password}
          onChange={(e) => onChangeField(e.target.value, 'password')}
        />
        <Button disabled={isLoading} extraClass={styles.button} htmlType="submit">
          Войти
        </Button>
      </form>
      <footer className={`${styles.actions}`}>
        <div className={styles.actionRow}>
          <p className="text text_type_main-default text_color_inactive">
            Вы — новый пользователь?
          </p>
          <Link to="/register" className={`${styles.link} text text_type_main-default`}>
            Зарегистрироваться
          </Link>
        </div>
        <div className={styles.actionRow}>
          <p className="text text_type_main-default text_color_inactive">
            Забыли пароль?
          </p>
          <Link
            to="/forgot-password"
            className={`${styles.link} text text_type_main-default`}
          >
            Восстановить пароль
          </Link>
        </div>
      </footer>
    </section>
  );
};
