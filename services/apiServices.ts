import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://yoshimi-vazadas.tecnomaub.site/api/register';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Retry uma vez em caso de erro de rede
    if (error.code === 'NETWORK_ERROR' && !originalRequest._retry) {
      originalRequest._retry = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return api(originalRequest);
    }

    // Se erro 401, limpa token
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // Aqui você pode disparar uma ação para atualizar o estado de autenticação, se quiser
    }

    return Promise.reject({
      message: error.response?.data?.message || 'Erro de conexão',
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;