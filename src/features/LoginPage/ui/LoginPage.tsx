import { Button } from '@/shared/ui/Button/Button';
import { Input } from '@/shared/ui/Input/Input';
import { type FormEvent, useState } from 'react';
import { useLogin } from '../hooks';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login, isPending, errorMessage, resetError } = useLogin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    resetError();

    login({ username, password });
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Login</h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Name:"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          label="Password:"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className={styles.buttonRow}>
          <Button type="submit" variant="primary" disabled={isPending}>
            Login
          </Button>
        </div>

        {errorMessage && (
          <div className={styles.error}>{errorMessage}</div>
        )}
      </form>
    </div>
  );
}
