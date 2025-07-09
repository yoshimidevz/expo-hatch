import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  Platform, 
  Image, 
  ActivityIndicator, 
  Alert,
  RefreshControl 
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import AlertService, { Alerta } from '@/services/alertService';

const App = () => {
  const [status, setStatus] = useState('ABERTO');
  const [connection, setConnection] = useState('CONECTADO');
  const [alerts, setAlerts] = useState<Alerta[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);

  // Função para buscar alertas
  const fetchAlerts = useCallback(async () => {
    try {
      setLoadingAlerts(true);
      
      // Verificar conectividade com a API
      const isConnected = await AlertService.checkConnection();
      setApiConnected(isConnected);
      
      if (!isConnected) {
        throw new Error('API não está acessível. Verifique sua conexão.');
      }

      const fetchedAlerts = await AlertService.getAlerts();
      setAlerts(fetchedAlerts.slice(0, 4)); // Pegando apenas os 4 mais recentes
    } catch (error: any) {
      console.error('Erro ao carregar alertas:', error);
      Alert.alert(
        'Erro ao carregar alertas', 
        error.message || 'Não foi possível carregar os alertas.',
        [
          { text: 'OK' },
          { text: 'Tentar novamente', onPress: fetchAlerts }
        ]
      );
      setAlerts([]);
      setApiConnected(false);
    } finally {
      setLoadingAlerts(false);
    }
  }, []);

  // Função para refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAlerts();
    setRefreshing(false);
  }, [fetchAlerts]);

  useEffect(() => {
    fetchAlerts();
    
    // Configurar intervalo para atualizar alertas a cada 30 segundos
    const interval = setInterval(fetchAlerts, 30000);
    
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const toggleStatus = () => {
    setStatus(prevStatus => (prevStatus === 'ABERTO' ? 'FECHADO' : 'ABERTO')); 
  };

  const toggleConnection = () => {
    setConnection(prevConn => (prevConn === 'CONECTADO' ? 'SEM CONEXÃO' : 'CONECTADO'));
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('pt-BR'),
        time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
    } catch (error) {
      return { date: 'Data inválida', time: '' };
    }
  };

  // Função para determinar o ícone do alerta
  const getAlertIcon = (message: string, type?: string) => {
    if (message.toLowerCase().includes('abriu') || message.toLowerCase().includes('aberto')) {
      return <Feather name="unlock" size={16} color="green" />;
    } else if (message.toLowerCase().includes('fechou') || message.toLowerCase().includes('fechado')) {
      return <Feather name="lock" size={16} color="red" />;
    } else if (type === 'warning') {
      return <Feather name="alert-triangle" size={16} color="orange" />;
    } else if (type === 'error') {
      return <Feather name="alert-circle" size={16} color="red" />;
    } else {
      return <Feather name="info" size={16} color="blue" />;
    }
  };

  // Função para determinar a cor de fundo do alerta
  const getAlertBackgroundColor = (message: string, type?: string) => {
    if (message.toLowerCase().includes('fechou') || message.toLowerCase().includes('fechado')) {
      return '#FFEBEE';
    } else if (message.toLowerCase().includes('abriu') || message.toLowerCase().includes('aberto')) {
      return '#E8F5E8';
    } else if (type === 'warning') {
      return '#FFF3E0';
    } else if (type === 'error') {
      return '#FFEBEE';
    } else {
      return '#FFFFFF';
    }
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#F5F5F5' }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: Platform.select({ ios: 100, android: 80 }),
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{
        marginBottom: 20,
        marginTop: 40,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
          }}>Boa tarde, Beatriz</Text>
          <Link href="/settings" asChild>
            <TouchableOpacity style={{
              padding: 5,
            }}>
              <View style={{
                position: 'relative',
              }}>
                <Image
                  source={require('@/assets/images/FOTO_PERFIL.png')}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: '#3498db',
                  }}
                />
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 15,
                  height: 15,
                  borderRadius: 7.5,
                  backgroundColor: apiConnected ? '#2ecc71' : '#e74c3c',
                  borderWidth: 2,
                  borderColor: 'white',
                }} />
              </View>
            </TouchableOpacity>
          </Link>
        </View>
        
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View style={{
            flex: 1,
            marginRight: 15,
          }}>
            <View style={{
              marginBottom: 10,
            }}>
              <Text style={{
                fontSize: 20,
                marginBottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Feather name="box" size={20} color="black" /> Comporta
              </Text>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: status === 'ABERTO' ? 'green' : 'red'
              }}>
                {status}
              </Text>
            </View>
            
            <TouchableOpacity onPress={toggleConnection} style={{
              marginBottom: 10,
            }}>
              <Text style={{
                fontSize: 20,
                marginBottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <FontAwesome5 name="signal" size={18} color="black" /> Conexão
              </Text>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: connection === 'CONECTADO' ? 'green' : 'red'
              }}>
                {connection}
              </Text>
            </TouchableOpacity>

            {/* Indicador de status da API */}
            <View style={{ marginBottom: 10 }}>
              <Text style={{
                fontSize: 20,
                marginBottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Feather name="server" size={16} color="black" /> API
              </Text>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: apiConnected ? 'green' : 'red'
              }}>
                {apiConnected ? 'CONECTADA' : 'DESCONECTADA'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 140,
              padding: 15,
              borderRadius: 15,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              backgroundColor: status === 'ABERTO' ? '#3498db' : '#e74c3c',
              shadowColor: status === 'ABERTO' ? '#3498db' : '#e74c3c',
              elevation: 10,
            }} 
            onPress={toggleStatus}
          >
            <Feather 
              name={status === 'ABERTO' ? 'unlock' : 'lock'} 
              size={80}
              color="white"
            />
            <Text style={{
              marginTop: 10,
              fontSize: 18,
              fontWeight: 'bold',
              color: 'white',
            }}>{status === 'ABERTO' ? 'Aberto' : 'Fechado'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de alertas */}
      <View style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
          }}>Últimos Alertas</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={fetchAlerts} style={{ marginRight: 10 }}>
              <Feather name="refresh-cw" size={16} color="#3498db" />
            </TouchableOpacity>
            <Link href="/statistic" asChild>
              <TouchableOpacity>
                <Text style={{
                  fontSize: 14,
                  color: '#3498db',
                }}>Ver todos</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        
        {loadingAlerts ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={{ marginTop: 10, color: '#666' }}>Carregando alertas...</Text>
          </View>
        ) : !apiConnected ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Feather name="wifi-off" size={24} color="#e74c3c" />
            <Text style={{ marginTop: 10, color: '#e74c3c', textAlign: 'center' }}>
              Sem conexão com a API
            </Text>
            <TouchableOpacity onPress={fetchAlerts} style={{ marginTop: 10 }}>
              <Text style={{ color: '#3498db' }}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : alerts.length > 0 ? (
          <FlatList
            data={alerts}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const { date, time } = formatDate(item.created_at);
              return (
                <View style={{
                  flexDirection: 'row',
                  padding: 12,
                  borderRadius: 8,
                  marginVertical: 4,
                  backgroundColor: getAlertBackgroundColor(item.message, item.type),
                  borderLeftWidth: 3,
                  borderLeftColor: item.message.toLowerCase().includes('fechou') ? '#e74c3c' : 
                                  item.message.toLowerCase().includes('abriu') ? '#2ecc71' : '#3498db',
                }}>
                  <View style={{
                    marginRight: 12,
                    justifyContent: 'center',
                  }}>
                    {getAlertIcon(item.message, item.type)}
                  </View>
                  <View style={{
                    flex: 1,
                  }}>
                    <Text style={{
                      fontSize: 16,
                      marginBottom: 4,
                      fontWeight: '500',
                    }}>{item.message}</Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#888',
                    }}>{date} • {time}</Text>
                    {item.sensor_data?.escotilha?.name && (
                      <Text style={{
                        fontSize: 12,
                        color: '#666',
                        marginTop: 2,
                      }}>Escotilha: {item.sensor_data.escotilha.name}</Text>
                    )}
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Feather name="bell-off" size={24} color="#888" />
            <Text style={{ marginTop: 10, textAlign: 'center', color: '#888' }}>
              Nenhum alerta encontrado.
            </Text>
          </View>
        )}
      </View>

      {/* Card de Estatísticas */}
      <Link href="/statistic" asChild>
        <TouchableOpacity style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          marginTop: 20,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#3498db',
            }}>Estatísticas Completas</Text>
            <Entypo name="circular-graph" size={24} color="#3498db" />
          </View>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            Visualize gráficos detalhados e histórico completo de operações
          </Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
};

export default App;