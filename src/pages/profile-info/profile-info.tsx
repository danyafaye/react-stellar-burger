import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAppDispatch } from '@hooks/useAppDispatch.ts';
import { useAppSelector } from '@hooks/useAppSelector.ts';
import { selectUpdateUserIsLoading, selectUser } from '@services/auth/selectors.ts';
import { updateUser } from '@services/auth/slice.ts';

import styles from './profile-info.module.css';

export const ProfileInfo = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectUpdateUserIsLoading);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isEditName, setIsEditName] = useState(false);
  const initialState = useMemo(() => {
    return { ...user, password: '' };
  }, [user]);
  const [profileData, setProfileData] = useState(initialState);

  const onChangeField = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const onReset = () => {
    setProfileData(initialState);
  };

  const onToggleDisable = () => {
    setIsEditName((prev) => !prev);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void dispatch(updateUser(profileData));
  };

  const isEqual = useMemo(() => {
    return JSON.stringify(profileData) === JSON.stringify(initialState);
  }, [profileData, initialState]);

  useEffect(() => {
    if (isEditName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditName]);

  return (
    <div className={styles.profileInfo}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          placeholder="Имя"
          name="name"
          value={profileData.name ?? ''}
          onChange={onChangeField}
          disabled={!isEditName || isLoading}
          icon="EditIcon"
          onBlur={onToggleDisable}
          onIconClick={onToggleDisable}
          ref={nameInputRef}
        />
        <EmailInput
          name="email"
          isIcon
          onChange={onChangeField}
          value={profileData.email ?? ''}
        />
        <PasswordInput
          placeholder="Пароль"
          name="password"
          onChange={onChangeField}
          value={profileData.password}
          icon="EditIcon"
        />
        {!isEqual && (
          <div className={styles.action}>
            <Button
              htmlType="reset"
              type="secondary"
              onClick={onReset}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button htmlType="submit" disabled={isLoading}>
              Сохранить
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
