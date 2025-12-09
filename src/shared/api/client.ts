import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://v2991160.hosted-by-vdsina.ru/api/v1',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
