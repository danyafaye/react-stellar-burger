import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { forgotPassword } from '@services/auth/slice.ts';

import styles from './forgot-password.module.css';

export const ForgotPassword = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void dispatch(forgotPassword({ email }));
  };

  return (
    <section className={styles.container}>
      <h2 className={`${styles.title} text text_type_main-medium`}>
        Восстановление пароля
      </h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <EmailInput
          placeholder="Укажите e-mail"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Button extraClass={styles.button} htmlType="submit">
          Восстановить
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
