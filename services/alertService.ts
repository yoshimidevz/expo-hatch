import axios from 'axios';
import { obterToken } from '@/utils/storage'; // Assumindo que obterToken está em utils/storage

const API_BASE_URL = 'http://10.20.17.105:8000/api'; // Use a URL base da sua API

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para adicionar o token de autenticação a cada requisição
api.interceptors.request.use(
  async (config) => {
    const token = await obterToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Alerta {
  id: string;
  message: string;
  created_at: string; // Data e hora do alerta
  // Adicione outros campos relevantes do seu modelo Alerta, se houver
}

class AlertService {
  async getAlerts(): Promise<Alerta[]> {
    try {
      const response = await api.get('/alertas'); // Endpoint para listar alertas
      if (response.data && response.data.data) {
        return response.data.data.map((alerta: any) => ({
          id: alerta.id.toString(),
          message: alerta.message,
          created_at: alerta.created_at,
          // Mapeie outros campos conforme necessário
        }));
      } else {
        throw new Error('Formato de resposta de alertas inválido');
      }
    } catch (error: any) {
      console.error('Erro ao buscar alertas:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erro ao buscar alertas');
    }
  }
}

export default new AlertService();