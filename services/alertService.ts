import api from './apiServices'; 

export const togglePistao = async (action: 'abrir' | 'fechar') => {
  try {
    const serial_number = 'ESP32-PORTA01';
    const response: any = await api.post('escotilhas/toggle', { serial_number, action });
    return response;
  } catch (error: any) {
    console.error('Erro ao enviar comando para pistão:', error.message);
    throw error;
  }
};

export interface Alerta {
  id: string;
  message: string;
  type: string;
  created_at: string;
  sensor_data_id?: string;
  sensor_data?: {
    id: string;
    escotilha?: { id: string; name: string; user_id: string };
    sensor?: { id: string; name: string };
  };
}

class AlertService {
  async getAlerts(): Promise<Alerta[]> {
    try {
      const response: any = await api.get('/alertas');
      if (response.data) {
        return response.data.map((alerta: any) => ({
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
      }
      throw new Error('Formato de resposta de alertas inválido');
    } catch (error: any) {
      console.error('Erro ao buscar alertas:', error.message);
      if (error.status === 401) throw new Error('Sessão expirada. Faça login novamente.');
      if (error.status === 403) throw new Error('Você não tem permissão para acessar os alertas.');
      if (error.status === 404) throw new Error('Endpoint de alertas não encontrado.');
      throw new Error(error.message || 'Erro ao buscar alertas');
    }
  }

  async getAlertById(id: string): Promise<Alerta> {
    try {
      const response: any = await api.get(`/alertas/${id}`);
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
      }
      throw new Error('Alerta não encontrado');
    } catch (error: any) {
      console.error('Erro ao buscar alerta por ID:', error.message);
      if (error.status === 404) throw new Error('Alerta não encontrado.');
      if (error.status === 401) throw new Error('Sessão expirada. Faça login novamente.');
      if (error.status === 403) throw new Error('Você não tem permissão para acessar este alerta.');
      throw new Error(error.message || 'Erro ao buscar alerta');
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await api.get('/status');
      return true;
    } catch {
      return false;
    }
  }
}

export default new AlertService();