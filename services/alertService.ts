import axios from 'axios';
import { obterToken } from '@/utils/storage';

const API_BASE_URL = 'https://yoshimi-vazadas.tecnomaub.site/api/'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
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

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      console.error('Token de autenticação inválido ou expirado');
    } else if (error.response?.status === 403) {
      console.error('Acesso negado');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Timeout na requisição');
    } else if (!error.response) {
      console.error('Erro de rede - verifique sua conexão');
    }
    return Promise.reject(error);
  }
);

export interface Alerta {
  id: string;
  message: string;
  type: string;
  created_at: string;
  sensor_data_id?: string;
  // Campos relacionados que podem vir da API
  sensor_data?: {
    id: string;
    escotilha?: {
      id: string;
      name: string;
      user_id: string;
    };
    sensor?: {
      id: string;
      name: string;
    };
  };
}

class AlertService {
  async getAlerts(): Promise<Alerta[]> {
    try {
      const response = await api.get('/alertas');
      
      if (response.data && response.data.data) {
        return response.data.data.map((alerta: any) => ({
          id: alerta.id.toString(),
          message: alerta.message,
          type: alerta.type || 'info',
          created_at: alerta.created_at,
          sensor_data_id: alerta.sensor_data_id?.toString(),
          sensor_data: alerta.sensor_data ? {
            id: alerta.sensor_data.id?.toString(),
            escotilha: alerta.sensor_data.escotilha ? {
              id: alerta.sensor_data.escotilha.id?.toString(),
              name: alerta.sensor_data.escotilha.name,
              user_id: alerta.sensor_data.escotilha.user_id?.toString(),
            } : undefined,
            sensor: alerta.sensor_data.sensor ? {
              id: alerta.sensor_data.sensor.id?.toString(),
              name: alerta.sensor_data.sensor.name,
            } : undefined,
          } : undefined,
        }));
      } else {
        throw new Error('Formato de resposta de alertas inválido');
      }
    } catch (error: any) {
      console.error('Erro ao buscar alertas:', error.response?.data || error.message);
      
      // Tratamento específico de erros
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      } else if (error.response?.status === 403) {
        throw new Error('Você não tem permissão para acessar os alertas.');
      } else if (error.response?.status === 404) {
        throw new Error('Endpoint de alertas não encontrado.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout na requisição. Verifique sua conexão.');
      } else if (!error.response) {
        throw new Error('Erro de rede. Verifique sua conexão com a internet.');
      } else {
        throw new Error(error.response?.data?.message || 'Erro ao buscar alertas');
      }
    }
  }

  async getAlertById(id: string): Promise<Alerta> {
    try {
      const response = await api.get(`/alertas/${id}`);
      
      if (response.data) {
        const alerta = response.data;
        return {
          id: alerta.id.toString(),
          message: alerta.message,
          type: alerta.type || 'info',
          created_at: alerta.created_at,
          sensor_data_id: alerta.sensor_data_id?.toString(),
          sensor_data: alerta.sensor_data ? {
            id: alerta.sensor_data.id?.toString(),
            escotilha: alerta.sensor_data.escotilha ? {
              id: alerta.sensor_data.escotilha.id?.toString(),
              name: alerta.sensor_data.escotilha.name,
              user_id: alerta.sensor_data.escotilha.user_id?.toString(),
            } : undefined,
            sensor: alerta.sensor_data.sensor ? {
              id: alerta.sensor_data.sensor.id?.toString(),
              name: alerta.sensor_data.sensor.name,
            } : undefined,
          } : undefined,
        };
      } else {
        throw new Error('Alerta não encontrado');
      }
    } catch (error: any) {
      console.error('Erro ao buscar alerta por ID:', error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        throw new Error('Alerta não encontrado.');
      } else if (error.response?.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      } else if (error.response?.status === 403) {
        throw new Error('Você não tem permissão para acessar este alerta.');
      } else {
        throw new Error(error.response?.data?.message || 'Erro ao buscar alerta');
      }
    }
  }

  // Método para verificar conectividade com a API
  async checkConnection(): Promise<boolean> {
    try {
      await api.get('/status');
      return true;
    } catch (error) {
      console.error('API não está acessível:', error);
      return false;
    }
  }
}

export default new AlertService();