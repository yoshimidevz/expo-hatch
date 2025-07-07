// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure a URL base da sua API Laravel
const BASE_URL = 'http://127.0.0.1:8000/api'; // Substitua pelo IP da sua máquina

// Crie uma instância do Axios com configurações padrão
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar automaticamente o token de autenticação
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
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.code === 'NETWORK_ERROR' && !originalRequest._retry) {
      originalRequest._retry = true;
      // Aguarda 1 segundo antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000));
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros globalmente
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // Aqui você pode disparar uma ação para atualizar o estado de autenticação
    }
    
    return Promise.reject({
      message: error.response?.data?.message || 'Erro de conexão',
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;