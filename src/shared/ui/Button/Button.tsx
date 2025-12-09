import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'primary';
}

export function Button({ variant = 'default', className, ...rest }: Props) {
    return (
        <button
            className={clsx(styles.button, variant === 'primary' && styles.primary, className)}
            {...rest}
        />
    );
}
