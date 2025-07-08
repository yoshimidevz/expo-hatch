import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import authService from '@/services/authService';
import { obterNomeUsuario } from '@/utils/storage';

const StatusScreen: React.FC = () => {
  const [status, setStatus] = useState<{
    status: string;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    loadUserName();
    checkSystemStatus();
  }, []);

  const loadUserName = async () => {
    try {
      const name = await obterNomeUsuario();
      setUserName(name || 'Usuário');
    } catch (error) {
      console.error('Erro ao carregar nome do usuário:', error);
    }
  };

  const checkSystemStatus = async () => {
    try {
      const systemStatus = await authService.verificarStatusSistema();
      setStatus(systemStatus);
    } catch (error) {
      setStatus({
        status: 'error',
        message: 'Erro ao verificar status do sistema'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    checkSystemStatus();
  };

  const retryCheck = () => {
    setLoading(true);
    checkSystemStatus();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#4CAF50'; // Verde
      case 'offline':
        return '#FF6B6B'; // Vermelho
      case 'error':
        return '#FFA726'; // Laranja
      default:
        return '#9E9E9E'; // Cinza
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return '✅';
      case 'offline':
        return '❌';
      case 'error':
        return '⚠️';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Verificando status do sistema...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Olá, {userName}!</Text>
          <Text style={styles.subtitle}>Status do Sistema</Text>
        </View>

        {status && (
          <View style={styles.statusContainer}>
            <View style={[styles.statusCard, { borderLeftColor: getStatusColor(status.status) }]}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusIcon}>{getStatusIcon(status.status)}</Text>
                <Text style={[styles.statusTitle, { color: getStatusColor(status.status) }]}>
                  {status.status.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.statusMessage}>{status.message}</Text>
              <Text style={styles.lastUpdate}>
                Última verificação: {new Date().toLocaleTimeString('pt-BR')}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.refreshButton} onPress={retryCheck}>
            <Text style={styles.refreshButtonText}>Verificar Novamente</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Sobre o Sistema</Text>
          <Text style={styles.infoText}>
            Este painel mostra o status atual do sistema. Puxe para baixo para atualizar 
            ou toque em "Verificar Novamente" para uma nova verificação.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  statusContainer: {
    marginBottom: 30,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusMessage: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#999999',
  },
  actionsContainer: {
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default StatusScreen;