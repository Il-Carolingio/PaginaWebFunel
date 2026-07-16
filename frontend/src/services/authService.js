// frontend/src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Login
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Solicitar reset de contraseña
export const solicitarReset = async (email) => {
  const response = await api.post('/auth/solicitar-reset', { email });
  return response.data;
};

// Validar token de reset
export const validarTokenReset = async (token) => {
  const response = await api.get(`/auth/validar-token-reset/${token}`);
  return response.data;
};

// Resetear contraseña
export const resetearPassword = async (token, password) => {
  const response = await api.post('/auth/resetear-password', { token, password });
  return response.data;
};

// Cambiar contraseña (usuario logueado)
export const cambiarPassword = async (passwordActual, passwordNuevo) => {
  const response = await api.post('/auth/cambiar-password', {
    passwordActual,
    passwordNuevo
  });
  return response.data;
};

// Verificar token
export const verificarToken = async () => {
  const response = await api.get('/auth/verificar');
  return response.data;
};

export default api;