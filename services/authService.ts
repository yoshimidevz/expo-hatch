import axios from 'axios';
import {
  logar,
  deslogar,
  verificaSeLogado,
  obterToken,
  obterDadosUsuario,
} from '../utils/storage';

const API_BASE_URL = 'https://yoshimi-vazadas.tecnomaub.site/'; //pro coworking eu uso 10.20.17.105:8000/api e em casa 192.168.0.162:8000/api e no visitante 10.20.14.109

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  status: string;
  status_code: number;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 segundos
});

class AuthService {
  /**
   * Realiza o login do usuário
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post('/login', credentials);
      
      console.log('Resposta completa do login:', JSON.stringify(response.data, null, 2));

      // CORREÇÃO: Verificar response.data.status === "success" em vez de response.data.success
      if (response.data.status === "success" || response.data.status_code === 200) {
        await logar(response.data.data.token, response.data.data.user);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Erro ao fazer login');
      }
    } catch (error: any) {
      console.error('Erro completo login:', JSON.stringify(error, null, 2));
      if (axios.isAxiosError(error)) {
        console.error('Erro axios.response login:', error.response);
        throw new Error(error.response?.data?.message || 'Erro de conexão no login');
      } else {
        console.error('Erro não axios login:', error);
        throw new Error(error.message || 'Erro desconhecido no login');
      }
    }
  }

  /**
   * Realiza o cadastro do usuário
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<LoginResponse> {
    try {
      console.log('Dados enviados para registro:', JSON.stringify(data, null, 2));
      
      const response = await api.post('/register', data);
      
      console.log('Resposta completa do registro:', JSON.stringify(response.data, null, 2));

      // CORREÇÃO: Verificar response.data.status === "success" em vez de response.data.success
      if (response.data.status === "success" || response.data.status_code === 200) {
        console.log('Cadastro bem-sucedido! Fazendo login automático...');
        await logar(response.data.data.token, response.data.data.user);
        console.log('Login automático realizado com sucesso!');
        return response.data;
      } else {
        console.error('Resposta de erro do servidor:', response.data);
        throw new Error(response.data.message || 'Erro ao registrar');
      }
    } catch (error: any) {
      console.error('Erro no registro - tipo:', typeof error);
      console.error('Erro no registro - conteúdo:', JSON.stringify(error, null, 2));
      
      if (axios.isAxiosError(error)) {
        console.error('É um erro do Axios');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Erro de conexão no registro');
      } else {
        console.error('Não é um erro do Axios');
        throw new Error(error?.message || 'Erro desconhecido no registro');
      }
    }
  }

  /**
   * Realiza o logout do usuário
   */
  async logout(): Promise<void> {
    try {
      const token = await obterToken();

      if (token) {
        await api.post(
          '/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error('Erro ao fazer logout na API:', error);
    } finally {
      await deslogar();
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    return await verificaSeLogado();
  }

  /**
   * Recupera os dados do usuário armazenados
   */
  async getUserData(): Promise<User | null> {
    return await obterDadosUsuario();
  }

  /**
   * Verifica o status do sistema
   */
  async verificarStatusSistema(): Promise<{ status: string; message: string }> {
    try {
      const token = await obterToken();

      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await api.get('/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // CORREÇÃO: Verificar response.data.status === "success"
      if (response.data.status === "success" || response.data.status_code === 200) {
        return {
          status: 'online',
          message: 'Sistema funcionando normalmente',
        };
      } else {
        return {
          status: 'error',
          message: response.data.message || 'Erro ao verificar status',
        };
      }
    } catch (error) {
      return {
        status: 'offline',
        message: 'Não foi possível conectar ao sistema',
      };
    }
  }

  /**
   * Função de teste para debug - mostra exatamente o que a API retorna
   */
  async testarResposta(): Promise<any> {
    try {
      console.log('=== TESTE DE RESPOSTA DA API ===');
      
      const response = await api.post('/register', {
        name: 'Teste Debug Final',
        email: 'teste.debug.final@teste.com',
        password: '123456',
        password_confirmation: '123456'
      });
      
      console.log('Tipo da resposta:', typeof response.data);
      console.log('Resposta completa:', JSON.stringify(response.data, null, 2));
      console.log('response.data.status:', response.data.status);
      console.log('response.data.status_code:', response.data.status_code);
      console.log('response.data.data:', response.data.data);
      
      return response.data;
    } catch (error) {
      console.error('Erro no teste:', error);
      throw error;
    }
  }
}

export default new AuthService();