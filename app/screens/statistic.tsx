import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

// Dados mockados para o mapa de calor
const heatmapData = [
  { location: 'Porto A', intensity: 0.8, count: 12 },
  { location: 'Porto B', intensity: 0.5, count: 7 },
  { location: 'Porto C', intensity: 0.3, count: 4 },
  { location: 'Porto D', intensity: 0.9, count: 15 },
];

const StatisticScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Título */}
      <Text style={styles.title}>Estatísticas de Operações</Text>
      
      {/* Mapa de Calor Simples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mapa de Calor de Fechamentos</Text>
        
        <View style={styles.heatmapContainer}>
          {heatmapData.map((item, index) => (
            <View key={index} style={styles.heatmapRow}>
              <View style={[
                styles.heatmapBar,
                { 
                  width: `${item.intensity * 100}%`,
                  backgroundColor: `rgba(231, 76, 60, ${item.intensity})` 
                }
              ]} />
              <Text style={styles.heatmapLabel}>
                {item.location} ({item.count} fechamentos)
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Resumo Estatístico */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo Geral</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Feather name="unlock" size={24} color="#2ecc71" />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Aberturas</Text>
          </View>
          
          <View style={styles.statCard}>
            <Feather name="lock" size={24} color="#e74c3c" />
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Fechamentos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Feather name="clock" size={24} color="#3498db" />
            <Text style={styles.statValue}>39</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.statCard}>
            <Feather name="map-pin" size={24} color="#9b59b6" />
            <Text style={styles.statValue}>Porto D</Text>
            <Text style={styles.statLabel}>Mais frequente</Text>
          </View>
        </View>
      </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Ver histórico completo</Text>
          <Feather name="chevron-right" size={20} color="#3498db" />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
    color: '#2c3e50',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50',
  },
  heatmapContainer: {
    marginTop: 10,
  },
  heatmapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: 30,
  },
  heatmapBar: {
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  heatmapLabel: {
    fontSize: 14,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  seeAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  seeAllText: {
    color: '#3498db',
    fontSize: 16,
    marginRight: 5,
  },
});

export default StatisticScreen;