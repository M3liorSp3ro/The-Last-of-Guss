export interface LoginParams {
    username: string;
    password: string;
}

export interface UseLoginResult {
    login: (params: LoginParams) => void;
    isPending: boolean;
    errorMessage: string | null;
    resetError: () => void;
}