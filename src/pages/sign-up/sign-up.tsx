import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { useAppSelector } from '@hooks/useAppSelector.ts';
import { selectRegisterIsLoading } from '@services/auth/selectors.ts';
import { registerUser } from '@services/auth/slice.ts';

import styles from './sign-up.module.css';

type SignUpForm = {
  name: string;
  email: string;
  password: string;
};

export const SignUp = () => {
  const location = useLocation();
  const isLoading = useAppSelector(selectRegisterIsLoading);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpForm>({
    email: '',
    name: '',
    password: '',
  });

  const onChangeField = (value: string, field: keyof SignUpForm) =>
    setFormData({ ...formData, [field]: value });

  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        const from = (location.state as { from?: { pathname?: string } } | null)
          ?.from ?? { pathname: '/' };
        void navigate(from, { replace: true });
      });
  };

  return (
    <section className={styles.container}>
      <h2 className={`${styles.title} text text_type_main-medium`}>Регистрация</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          disabled={isLoading}
          placeholder="Имя"
          value={formData.name}
          onChange={(e) => onChangeField(e.target.value, 'name')}
        />
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
          Зарегистрироваться
        </Button>
      </form>
      <footer className={`${styles.actions}`}>
        <div className={styles.actionRow}>
          <p className="text text_type_main-default text_color_inactive">
            Уже зарегистрированы?
          </p>
          <Link to="/login" className={`${styles.link} text text_type_main-default`}>
            Войти
          </Link>
        </div>
      </footer>
    </section>
  );
};
