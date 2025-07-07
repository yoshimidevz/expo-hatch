import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';

const SettingsScreen = () => {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header com foto de perfil */}
      <View style={styles.profileHeader}>
        <Image
          source={require('@/assets/images/FOTO_PERFIL.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Beatriz Yoshimi</Text>
        <Text style={styles.profileLocation}>Paraná, PR - Brasil</Text>
        
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Feather name="phone" size={16} color="#3498db" />
            <Text style={styles.contactText}>+55 (41) 9 9270-7773</Text>
          </View>
          <View style={styles.contactItem}>
            <Feather name="mail" size={16} color="#3498db" />
            <Text style={styles.contactText}>yoshimidevi@gmail.com</Text>
          </View>
        </View>
      </View>

      {/* Seção de Conta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Edit profile</Text>
          <Feather name="chevron-right" size={20} color="#7f8c8d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Security</Text>
          <Feather name="chevron-right" size={20} color="#7f8c8d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Privacy</Text>
          <Feather name="chevron-right" size={20} color="#7f8c8d" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Notifications</Text>
          <Feather name="chevron-right" size={20} color="#7f8c8d" />
        </TouchableOpacity>
      </View>

      {/* Seção de Preferências */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Language</Text>
          <Text style={styles.optionValue}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Darkmode</Text>
          <Feather name="toggle-right" size={20} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Only Download via Wifi</Text>
          <Feather name="toggle-right" size={20} color="#3498db" />
        </TouchableOpacity>
      </View>

      {/* Botão de Logout */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Espaço extra no final para rolagem */}
      <View style={styles.footerSpace} />
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
    paddingBottom: 40, // Espaço extra no final
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#3498db',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileLocation: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  contactInfo: {
    width: '100%',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#2c3e50',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f8c8d',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  optionText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  optionValue: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  logoutButton: {
    backgroundColor: '#1A324F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerSpace: {
    height: 80, // Espaço extra no final para melhor rolagem
  },
});

export default SettingsScreen;