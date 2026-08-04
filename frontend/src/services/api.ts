import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (data: { username: string; password: string }) =>
        api.post('/api/auth/login', data),

    register: (data: any) =>
        api.post('/api/auth/register', data),

    getProfile: () =>
        api.get('/api/auth/profile'),

    verifyToken: () =>
        api.post('/api/auth/verify'),
};

export const userService = {
    getAll: () => api.get('/api/users'),
    getById: (id: number) => api.get(`/api/users/${id}`),
    create: (data: any) => api.post('/api/users', data),
    update: (id: number, data: any) => api.put(`/api/users/${id}`, data),
    delete: (id: number) => api.delete(`/api/users/${id}`),
};

export const deviceService = {
    getAll: () => api.get('/api/devices'),
    getById: (id: number) => api.get(`/api/devices/${id}`),
    create: (data: any) => api.post('/api/devices', data),
    update: (id: number, data: any) => api.put(`/api/devices/${id}`, data),
    delete: (id: number) => api.delete(`/api/devices/${id}`),
};

export const measurementService = {
    getAll: (params?: any) => api.get('/api/measurements', { params }),
    getLatest: (deviceId: number, limit?: number) =>
        api.get(`/api/measurements/latest/${deviceId}`, { params: { limit } }),
    getStatistics: (deviceId: number, hours?: number) =>
        api.get(`/api/measurements/statistics/${deviceId}`, { params: { hours } }),
    create: (data: any) => api.post('/api/measurements', data),
};

export const ruleService = {
    getAll: () => api.get('/api/rules'),
    getActive: () => api.get('/api/rules/active'),
    getById: (id: number) => api.get(`/api/rules/${id}`),
    create: (data: any) => api.post('/api/rules', data),
    update: (id: number, data: any) => api.put(`/api/rules/${id}`, data),
    delete: (id: number) => api.delete(`/api/rules/${id}`),
};

export default api;