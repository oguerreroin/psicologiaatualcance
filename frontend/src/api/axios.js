import axios from 'axios';

// VITE_API_BASE_URL configurado vía .env o default local Tomcat port
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/psicologia-a-tu-alcance/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Inyectar token JWT/MOCK
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Manejo global de errores y 401
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                console.warn('Sesión expirada o no autorizada. Redirigiendo a login.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Usamos CustomEvent para notificar al AuthContext globalmente
                window.dispatchEvent(new Event('auth:unauthorized'));
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
