import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import alertService, { Alerta } from '@/services/alertService';
import pdfService from '@/services/pdfSerivce';

const StatisticScreen = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    loadAlertas();
  }, []);

  const loadAlertas = async () => {
    try {
      const data = await alertService.getAlerts();
      setAlertas(data);
      setApiConnected(true);
    } catch (error: any) {
      console.error('Erro ao carregar alertas:', error);
      setApiConnected(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAlertas();
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      const filePath = await pdfService.generateAlertsPDF();
      if (filePath) {
        console.log('PDF gerado com sucesso:', filePath);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleGenerateExamplePDF = async () => {
    setGeneratingPDF(true);
    try {
      const filePath = await pdfService.generateExamplePDF();
      if (filePath) {
        console.log('PDF de exemplo gerado com sucesso:', filePath);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF de exemplo:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Calcular estatísticas dos alertas
  const getAlertStats = () => {
    const total = alertas.length;
    const hoje = new Date().toDateString();
    const alertasHoje = alertas.filter(alerta => 
      new Date(alerta.created_at).toDateString() === hoje
    ).length;

    // Contar tipos de alertas
    const tiposAlertas = alertas.reduce((acc, alerta) => {
      const message = alerta.message.toLowerCase();
      if (message.includes('temperatura')) acc.temperatura++;
      else if (message.includes('umidade')) acc.umidade++;
      else if (message.includes('pressão')) acc.pressao++;
      else if (message.includes('nível')) acc.nivel++;
      else if (message.includes('vibração')) acc.vibracao++;
      else acc.outros++;
      return acc;
    }, {
      temperatura: 0,
      umidade: 0,
      pressao: 0,
      nivel: 0,
      vibracao: 0,
      outros: 0
    });

    return { total, alertasHoje, tiposAlertas };
  };

  const stats = getAlertStats();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando estatísticas...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Título */}
      <Text style={styles.title}>Estatísticas de Alertas</Text>
      
      {/* Status da API */}
      <View style={styles.statusSection}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: apiConnected ? '#2ecc71' : '#e74c3c' }]} />
          <Text style={styles.statusText}>
            {apiConnected ? 'API Conectada' : 'API Desconectada'}
          </Text>
        </View>
      </View>

      {/* Estatísticas Gerais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo Geral</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Feather name="alert-triangle" size={24} color="#e74c3c" />
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total de Alertas</Text>
          </View>
          
          <View style={styles.statCard}>
            <Feather name="calendar" size={24} color="#3498db" />
            <Text style={styles.statValue}>{stats.alertasHoje}</Text>
            <Text style={styles.statLabel}>Alertas Hoje</Text>
          </View>
          
          <View style={styles.statCard}>
            <Feather name="activity" size={24} color="#2ecc71" />
            <Text style={styles.statValue}>
              {apiConnected ? 'Online' : 'Offline'}
            </Text>
            <Text style={styles.statLabel}>Status Sistema</Text>
          </View>
          
          <View style={styles.statCard}>
            <Feather name="clock" size={24} color="#f39c12" />
            <Text style={styles.statValue}>
              {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={styles.statLabel}>Última Atualização</Text>
          </View>
        </View>
      </View>

      {/* Distribuição por Tipo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distribuição por Tipo</Text>
        
        <View style={styles.heatmapContainer}>
          {Object.entries(stats.tiposAlertas).map(([tipo, count], index) => {
            if (count === 0) return null;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            const intensity = percentage / 100;
            
            return (
              <View key={index} style={styles.heatmapRow}>
                <View style={[
                  styles.heatmapBar,
                  { 
                    width: `${Math.max(percentage, 5)}%`,
                    backgroundColor: `rgba(52, 152, 219, ${Math.max(intensity, 0.3)})` 
                  }
                ]} />
                <View style={styles.heatmapInfo}>
                  <Text style={styles.heatmapLabel}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </Text>
                  <Text style={styles.heatmapSubLabel}>
                    {count} alerta{count !== 1 ? 's' : ''} ({percentage.toFixed(1)}%)
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Seção de Relatórios */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relatórios</Text>
        <Text style={styles.sectionDescription}>
          Gere relatórios em HTML dos alertas do sistema. Os arquivos podem ser abertos em qualquer navegador e salvos como PDF.
        </Text>
        
        <View style={styles.pdfButtonsContainer}>
          <TouchableOpacity 
            style={[styles.pdfButton, styles.primaryButton]} 
            onPress={handleGeneratePDF}
            disabled={generatingPDF || !apiConnected}
          >
            {generatingPDF ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Feather name="file-text" size={20} color="white" />
            )}
            <Text style={styles.pdfButtonText}>
              {generatingPDF ? 'Gerando...' : 'Gerar Relatório dos Alertas'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.pdfButton, styles.secondaryButton]} 
            onPress={handleGenerateExamplePDF}
            disabled={generatingPDF}
          >
            {generatingPDF ? (
              <ActivityIndicator size="small" color="#3498db" />
            ) : (
              <Feather name="file" size={20} color="#3498db" />
            )}
            <Text style={[styles.pdfButtonText, { color: '#3498db' }]}>
              Relatório de Exemplo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Feather name="info" size={16} color="#3498db" />
          <Text style={styles.infoText}>
            Os relatórios são gerados em formato HTML e podem ser abertos em qualquer navegador. 
            Use a função "Imprimir" do navegador para salvar como PDF.
          </Text>
        </View>
      </View>

      {/* Alertas Recentes */}
      {alertas.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas Recentes</Text>
          
          {alertas.slice(0, 5).map((alerta, index) => (
            <View key={alerta.id} style={styles.alertaItem}>
              <View style={styles.alertaIcon}>
                <Feather name="alert-circle" size={16} color="#e74c3c" />
              </View>
              <View style={styles.alertaContent}>
                <Text style={styles.alertaMessage} numberOfLines={2}>
                  {alerta.message}
                </Text>
                <Text style={styles.alertaDate}>
                  {new Date(alerta.created_at).toLocaleString('pt-BR')}
                </Text>
              </View>
            </View>
          ))}
          
          {alertas.length > 5 && (
            <Text style={styles.moreAlertsText}>
              E mais {alertas.length - 5} alerta{alertas.length - 5 !== 1 ? 's' : ''}...
            </Text>
          )}
        </View>
      )}

      {/* Botão de Atualização */}
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Feather name="refresh-cw" size={20} color="#3498db" />
        <Text style={styles.refreshText}>Atualizar Dados</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
    color: '#2c3e50',
  },
  statusSection: {
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  heatmapContainer: {
    marginTop: 10,
  },
  heatmapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    minHeight: 35,
  },
  heatmapBar: {
    height: 20,
    borderRadius: 4,
    marginRight: 15,
    minWidth: 20,
  },
  heatmapInfo: {
    flex: 1,
  },
  heatmapLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  heatmapSubLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  pdfButtonsContainer: {
    gap: 10,
    marginBottom: 15,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  pdfButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e8f4fd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#2980b9',
    lineHeight: 16,
  },
  alertaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  alertaIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  alertaContent: {
    flex: 1,
  },
  alertaMessage: {
    fontSize: 13,
    color: '#2c3e50',
    lineHeight: 18,
  },
  alertaDate: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 2,
  },
  moreAlertsText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  refreshButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshText: {
    color: '#3498db',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
});

export default StatisticScreen;