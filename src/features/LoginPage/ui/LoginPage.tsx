import { login as loginApi } from '@/shared/api/auth';
import { useMutation } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => loginApi(username, password),
    onSuccess: (data) => {
      // data = { user, token ]
      auth.login(data.token, data.user);
      navigate('/rounds');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message ?? 'Ошибка входа';
      setFormError(msg);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    mutation.mutate();
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Войти</h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Имя пользователя:"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          label="Пароль:"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className={styles.buttonRow}>
          <Button
            type="submit"
            variant="primary"
            disabled={mutation.isPending}
          >
            Войти
          </Button>
        </div>

        {formError && <div className={styles.error}>{formError}</div>}
      </form>
    </div>
  );
}
