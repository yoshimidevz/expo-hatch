import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';

import { useEscotilhaStatus } from '@/hooks/useEscotilhaStatus';


// Dados ajustados com menos fechamentos
const alertsData = [
  { id: '1', message: 'ESCOTILHA ABRIU A COMPORTA', time: '18:25', date: '2023-05-15' },
  { id: '2', message: 'ESCOTILHA FECHOU A COMPORTA', time: '14:53', date: '2023-05-20' },
  { id: '3', message: 'ESCOTILHA ABRIU A COMPORTA', time: '11:13', date: '2023-06-05' },
  { id: '4', message: 'ESCOTILHA FECHOU A COMPORTA', time: '09:30', date: '2023-06-10' },
].slice(0, 4); // Pegando apenas os 4 mais recentes

const App = () => {
  const [connection, setConnection] = useState('CONECTADO');

  const { status, toggleStatus } = useEscotilhaStatus();



  const toggleConnection = () => {
    setConnection(prevConn => (prevConn === 'CONECTADO' ? 'SEM CONEXÃO' : 'CONECTADO'));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Text style={styles.greeting}>Boa tarde, Beatriz</Text>
          <Link href="/settings" asChild>
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={require('@/assets/images/FOTO_PERFIL.png')}
                  style={styles.profileImage}
                />
                <View style={styles.onlineIndicator} />
              </View>
            </TouchableOpacity>
          </Link>
        </View>
        
        <View style={styles.statusRow}>
          <View style={styles.statusContainer}>
            <View style={styles.statusGroup}>
              <Text style={styles.statusLabel}>
                <Feather name="box" size={20} color="black" /> Comporta
              </Text>
              <Text style={[styles.statusValue, {color: status === 'ABERTO' ? 'green' : 'red'}]}>
                {status}
              </Text>
            </View>
            
            <TouchableOpacity onPress={toggleConnection} style={styles.statusGroup}>
              <Text style={styles.connectionLabel}>
                <FontAwesome5 name="signal" size={18} color="black" /> Conexão
              </Text>
              <Text style={[
                styles.connectionValue, 
                {color: connection === 'CONECTADO' ? 'green' : 'red'}
              ]}>
                {connection}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.iconButton,
              { 
                backgroundColor: status === 'ABERTO' ? '#3498db' : '#e74c3c',
                shadowColor: status === 'ABERTO' ? '#3498db' : '#e74c3c',
                elevation: 10,
              }
            ]} 
            onPress={toggleStatus}
          >
            <Feather 
              name={status === 'ABERTO' ? 'unlock' : 'lock'} 
              size={80}
              color="white"
            />
            <Text style={styles.buttonLabel}>{status === 'ABERTO' ? 'Aberto' : 'Fechado'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de alertas reduzida */}
      <View style={styles.alertSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.alertsHeader}>Últimos Alertas</Text>
          <Link href="/statistic" asChild>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        <FlatList
          data={alertsData}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[
              styles.alertItem,
              item.message.includes('FECHOU') ? styles.alertItemClosed : styles.alertItemOpen
            ]}>
              <View style={styles.alertIcon}>
                {item.message.includes('ABRIU') ? (
                  <Feather name="unlock" size={16} color="green" />
                ) : (
                  <Feather name="lock" size={16} color="red" />
                )}
              </View>
              <View style={styles.alertContent}>
                <Text style={styles.alertMessage}>{item.message}</Text>
                <Text style={styles.alertTime}>{item.date} • {item.time}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Card de Estatísticas - Movido para baixo */}
      <Link href="/statistic" asChild>
        <TouchableOpacity style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Estatísticas Completas</Text>
            <Entypo name="circular-graph" size={24} color="#3498db" />
          </View>
          <Text style={styles.statsText}>
            Visualize gráficos detalhados e histórico completo de operações
          </Text>
        </TouchableOpacity>
      </Link>
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
    paddingBottom: Platform.select({ ios: 100, android: 80 }),
  },
  header: {
    marginBottom: 20,
    marginTop: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 5,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#2ecc71',
    borderWidth: 2,
    borderColor: 'white',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flex: 1,
    marginRight: 15,
  },
  statusGroup: {
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 20,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  connectionLabel: {
    fontSize: 20,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 140,
    padding: 15,
    borderRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonLabel: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statsCard: {
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
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  alertSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: '#3498db',
  },
  alertItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  alertItemOpen: {
    backgroundColor: '#FFFFFF',
  },
  alertItemClosed: {
    backgroundColor: '#FFEBEE',
  },
  alertIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 14,
    color: '#888',
  },
});

export default App;