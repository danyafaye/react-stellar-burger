import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { useAppSelector } from '@hooks/useAppSelector.ts';
import { selectRegisterIsLoading } from '@services/auth/selectors.ts';
import { resetPassword } from '@services/auth/slice.ts';

import styles from './reset-password.module.css';

type ResetPasswordForm = {
  password: string;
  token: string;
};

export const ResetPassword = () => {
  const params = useParams<{ token: string }>();
  const isLoading = useAppSelector(selectRegisterIsLoading);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ResetPasswordForm>({
    password: '',
    token: params.token ?? '',
  });

  const onChangeField = (value: string, field: keyof ResetPasswordForm) =>
    setFormData({ ...formData, [field]: value });

  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void dispatch(resetPassword(formData))
      .unwrap()
      .then(() => {
        void navigate('/login');
      });
  };

  return (
    <section className={styles.container}>
      <h2 className={`${styles.title} text text_type_main-medium`}>
        Восстановление пароля
      </h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <PasswordInput
          placeholder="Введите новый пароль"
          disabled={isLoading}
          value={formData.password}
          onChange={(e) => onChangeField(e.target.value, 'password')}
        />
        <Input
          disabled={isLoading}
          placeholder="Введите код из письма"
          value={formData.token}
          onChange={(e) => onChangeField(e.target.value, 'token')}
        />
        <Button disabled={isLoading} extraClass={styles.button} htmlType="submit">
          Сохранить
        </Button>
      </form>
      <footer className={`${styles.actions}`}>
        <div className={styles.actionRow}>
          <p className="text text_type_main-default text_color_inactive">
            Вспомнили пароль?
          </p>
          <Link to="/login" className={`${styles.link} text text_type_main-default`}>
            Войти
          </Link>
        </div>
      </footer>
    </section>
  );
};
