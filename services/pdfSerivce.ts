import { Alert, Platform } from 'react-native';
import alertService, { Alerta } from '@/services/alertService';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

class PDFService {
  /**
   * Gera um PDF simples usando HTML e compartilha via sistema nativo
   * Esta é uma alternativa que não depende de react-native-html-to-pdf
   */
  async generateAlertsPDF(): Promise<string | null> {
    try {
      // Buscar alertas da API
      const alertas = await alertService.getAlerts();
      
      if (!alertas || alertas.length === 0) {
        Alert.alert('Aviso', 'Nenhum alerta encontrado para gerar o PDF.');
        return null;
      }

      // Gerar conteúdo HTML
      const htmlContent = this.generateHTMLContent(alertas);
      
      // Criar arquivo HTML temporário
      const fileName = `alertas_${new Date().toISOString().split('T')[0]}.html`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Compartilhar o arquivo HTML
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/html',
          dialogTitle: 'Relatório de Alertas',
        });
        
        Alert.alert(
          'Relatório Gerado!', 
          'O relatório HTML foi criado e está sendo compartilhado. Você pode abri-lo em um navegador e salvá-lo como PDF.',
          [{ text: 'OK' }]
        );
        
        return fileUri;
      } else {
        Alert.alert(
          'Relatório Criado!', 
          `Arquivo HTML salvo em: ${fileUri}`,
          [{ text: 'OK' }]
        );
        return fileUri;
      }

    } catch (error: any) {
      console.error('Erro ao gerar relatório:', error);
      Alert.alert(
        'Erro',
        `Não foi possível gerar o relatório: ${error.message}`,
        [{ text: 'OK' }]
      );
      return null;
    }
  }

  /**
   * Gera um relatório de exemplo
   */
  async generateExamplePDF(): Promise<string | null> {
    try {
      const alertasExemplo: Alerta[] = [
        {
          id: '1',
          message: 'Alerta Escotilha 1',
          created_at: new Date().toISOString(),
          type: 'distancia'
        },
        {
          id: '2',
          message: 'Alerta Escotilha 2',
          created_at: new Date().toISOString(),
          type: 'fotoresitor'
        },
        {
          id: '3',
          message: 'Alerta Escotilha 3',
          created_at: new Date().toISOString(),
          type: 'distancia'
        },
        {
          id: '4',
          message: 'Alerta Escotilha 1',
          created_at: new Date().toISOString(),
          type: 'fotoresistor'
        },
        {
          id: '5',
          message: 'Alerta Escotilha 4',
          created_at: new Date().toISOString(),
          type: 'distancia'
        }
      ];

      const htmlContent = this.generateHTMLContent(alertasExemplo);
      
      const fileName = `alertas_exemplo_${new Date().toISOString().split('T')[0]}.html`;
      const fileUri = FileSystem.documentDirectory + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/html',
          dialogTitle: 'Relatório de Alertas (Exemplo)',
        });
        
        Alert.alert(
          'Relatório de Exemplo Gerado!', 
          'O relatório HTML foi criado e está sendo compartilhado. Você pode abri-lo em um navegador e salvá-lo como PDF.',
          [{ text: 'OK' }]
        );
        
        return fileUri;
      } else {
        Alert.alert(
          'Relatório de Exemplo Criado!', 
          `Arquivo HTML salvo em: ${fileUri}`,
          [{ text: 'OK' }]
        );
        return fileUri;
      }

    } catch (error: any) {
      console.error('Erro ao gerar relatório de exemplo:', error);
      Alert.alert(
        'Erro',
        `Não foi possível gerar o relatório de exemplo: ${error.message}`,
        [{ text: 'OK' }]
      );
      return null;
    }
  }

  /**
   * Gera o conteúdo HTML para o relatório
   */
  private generateHTMLContent(alertas: Alerta[]): string {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const currentTime = new Date().toLocaleTimeString('pt-BR');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Alertas</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
            color: #333;
            line-height: 1.6;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 20px;
          }
          
          .header h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          
          .header p {
            color: #7f8c8d;
            margin: 8px 0;
            font-size: 16px;
          }
          
          .summary {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border-left: 5px solid #3498db;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .summary h3 {
            margin: 0 0 15px 0;
            color: #2c3e50;
            font-size: 18px;
          }
          
          .summary p {
            margin: 8px 0;
            font-size: 15px;
          }
          
          .summary strong {
            color: #3498db;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-radius: 10px;
            overflow: hidden;
          }
          
          th {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          td {
            padding: 12px;
            border-bottom: 1px solid #ecf0f1;
            font-size: 13px;
          }
          
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          
          tr:hover {
            background-color: #e8f4fd;
            transition: background-color 0.3s ease;
          }
          
          .alert-id {
            text-align: center;
            font-weight: bold;
            color: #3498db;
            font-size: 14px;
          }
          
          .alert-message {
            max-width: 400px;
            word-wrap: break-word;
            line-height: 1.5;
          }
          
          .alert-date {
            text-align: center;
            color: #7f8c8d;
            font-size: 12px;
            white-space: nowrap;
          }
          
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 13px;
            color: #95a5a6;
            border-top: 2px solid #ecf0f1;
            padding-top: 20px;
          }
          
          .no-alerts {
            text-align: center;
            color: #7f8c8d;
            font-style: italic;
            padding: 60px 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
            margin: 20px 0;
          }
          
          .no-alerts h3 {
            color: #95a5a6;
            margin-bottom: 10px;
          }
          
          .print-button {
            background-color: #3498db;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin: 20px 0;
            transition: background-color 0.3s ease;
          }
          
          .print-button:hover {
            background-color: #2980b9;
          }
          
          @media (max-width: 768px) {
            body { margin: 10px; }
            .header h1 { font-size: 24px; }
            table { font-size: 12px; }
            th, td { padding: 8px 6px; }
          }
        </style>
      </head>
      <body>
        <div class="no-print">
          <button class="print-button" onclick="window.print()">🖨️ Imprimir / Salvar como PDF</button>
        </div>
        
        <div class="header">
          <h1>📊 Relatório de Alertas</h1>
          <p><strong>Gerado em:</strong> ${currentDate} às ${currentTime}</p>
          <p>Sistema de Monitoramento de Escotilhas</p>
        </div>

        <div class="summary">
          <h3>📋 Resumo do Relatório</h3>
          <p><strong>Total de Alertas:</strong> ${alertas.length}</p>
          <p><strong>Período:</strong> Todos os alertas disponíveis</p>
          <p><strong>Status:</strong> Dados obtidos da API em tempo real</p>
          <p><strong>Formato:</strong> Relatório HTML (pode ser salvo como PDF)</p>
        </div>

        ${alertas.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th style="width: 80px;">🆔 ID</th>
                <th style="width: 450px;">📝 Mensagem do Alerta</th>
                <th style="width: 150px;">📅 Data/Hora</th>
              </tr>
            </thead>
            <tbody>
              ${alertas.map(alerta => `
                <tr>
                  <td class="alert-id">#${alerta.id}</td>
                  <td class="alert-message">${alerta.message}</td>
                  <td class="alert-date">${this.formatDate(alerta.created_at)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `
          <div class="no-alerts">
            <h3>📭 Nenhum alerta encontrado</h3>
            <p>Não há alertas registrados no sistema no momento.</p>
          </div>
        `}

        <div class="footer">
          <p><strong>📱 Sistema de Monitoramento de Escotilhas</strong></p>
          <p>Este relatório foi gerado automaticamente pelo aplicativo móvel.</p>
          <p>Para mais informações, consulte o sistema principal.</p>
          <p><em>Relatório gerado em ${currentDate} às ${currentTime}</em></p>
        </div>
        
        <div class="no-print">
          <button class="print-button" onclick="window.print()">🖨️ Imprimir / Salvar como PDF</button>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Formata a data para exibição no relatório
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }
}

export default new PDFService();