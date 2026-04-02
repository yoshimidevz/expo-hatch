import { logar, deslogar, verificaSeLogado, obterToken, obterDadosUsuario } from '../utils/storage';
import api from './apiServices';

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
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response: any = await api.post('/login', credentials);
      console.log('Resposta login:', JSON.stringify(response, null, 2));

      if (response.status === 'success') {
        await logar(response.data.token, response.data.user);
        return response;
      } else {
        throw new Error(response.message || 'Erro ao fazer login');
      }
    } catch (error: any) {
      console.error('Erro login:', error);
      throw new Error(error?.message || 'Erro de conexão no login');
    }
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<LoginResponse> {
    try {
      console.log('Dados registro:', JSON.stringify(data, null, 2));
      const response: any = await api.post('/register', data);
      console.log('Resposta registro:', JSON.stringify(response, null, 2));

      if (response.status === 'success') {
        await logar(response.data.token, response.data.user);
        return response;
      } else {
        throw new Error(response.message || 'Erro ao registrar');
      }
    } catch (error: any) {
      console.error('Erro registro:', error);
      throw new Error(error?.message || 'Erro de conexão no registro');
    }
  }

  async logout(): Promise<void> {
    try {
      const token = await obterToken();
      if (token) {
        await api.post('/logout', {});
      }
    } catch (error) {
      console.error('Erro ao fazer logout na API:', error);
    } finally {
      await deslogar();
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return await verificaSeLogado();
  }

  async getUserData(): Promise<User | null> {
    return await obterDadosUsuario();
  }

  async verificarStatusSistema(): Promise<{ status: string; message: string }> {
    try {
      const response: any = await api.get('/status');
      if (response.status === 'success') {
        return { status: 'online', message: 'Sistema funcionando normalmente' };
      }
      return { status: 'error', message: response.message || 'Erro ao verificar status' };
    } catch {
      return { status: 'offline', message: 'Não foi possível conectar ao sistema' };
    }
  }
}

export default new AuthService();