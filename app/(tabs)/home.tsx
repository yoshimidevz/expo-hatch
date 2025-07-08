import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, Platform, Image, ActivityIndicator, Alert } from 'react-native';
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

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoadingAlerts(true);
        const fetchedAlerts = await AlertService.getAlerts();
        setAlerts(fetchedAlerts.slice(0, 4)); // Pegando apenas os 4 mais recentes
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Não foi possível carregar os alertas.');
        setAlerts([]);
      } finally {
        setLoadingAlerts(false);
      }
    };

    fetchAlerts();
  }, []);

  const toggleStatus = () => {
    setStatus(prevStatus => (prevStatus === 'ABERTO' ? 'FECHADO' : 'ABERTO')); 
  };

  const toggleConnection = () => {
    setConnection(prevConn => (prevConn === 'CONECTADO' ? 'SEM CONEXÃO' : 'CONECTADO'));
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#F5F5F5' }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: Platform.select({ ios: 100, android: 80 }),
      }}
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
                  backgroundColor: '#2ecc71',
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
          <Link href="/statistic" asChild>
            <TouchableOpacity>
              <Text style={{
                fontSize: 14,
                color: '#3498db',
              }}>Ver todos</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        {loadingAlerts ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : alerts.length > 0 ? (
          <FlatList
            data={alerts}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{
                flexDirection: 'row',
                padding: 12,
                borderRadius: 8,
                marginVertical: 4,
                backgroundColor: item.message.includes('FECHOU') ? '#FFEBEE' : '#FFFFFF',
              }}>
                <View style={{
                  marginRight: 12,
                  justifyContent: 'center',
                }}>
                  {item.message.includes('ABRIU') ? (
                    <Feather name="unlock" size={16} color="green" />
                  ) : (
                    <Feather name="lock" size={16} color="red" />
                  )}
                </View>
                <View style={{
                  flex: 1,
                }}>
                  <Text style={{
                    fontSize: 16,
                    marginBottom: 4,
                  }}>{item.message}</Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#888',
                  }}>{new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={{ textAlign: 'center', color: '#888' }}>Nenhum alerta encontrado.</Text>
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