import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/providers/AuthProvider';
import { login as loginApi } from '@/shared/api/auth';
import { LoginResult } from '@/shared/types/auth';
import { LoginParams, UseLoginResult } from '../types';



export function useLogin(): UseLoginResult {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const auth = useAuth();
    const navigate = useNavigate();

    const { mutate, isPending, reset } = useMutation<LoginResult, unknown, LoginParams>({
        mutationFn: ({ username, password }) => loginApi(username, password),
        onSuccess: (data) => {
            auth.login(data.token, data.user);
            navigate('/rounds');
        },
        onError: (error) => {
            let msg = 'Ошибка входа';

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const anyErr = error as any;

            if (anyErr?.response?.data?.message) {
                msg = String(anyErr.response.data.message);
            } else if (anyErr?.message) {
                msg = String(anyErr.message);
            }

            setErrorMessage(msg);
        },
    });

    const login = (params: LoginParams) => {
        setErrorMessage(null);
        mutate(params);
    };

    const resetError = () => {
        setErrorMessage(null);
        reset();
    };

    return {
        login,
        isPending,
        errorMessage,
        resetError,
    };
}
