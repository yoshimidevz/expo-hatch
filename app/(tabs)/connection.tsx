import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ConnectionScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>ESCOTILHA INTELIGENTE</Text>
      
      {/* Círculo para a foto */}
      <View style={styles.circle}>
        <Image 
          source={require('@/assets/images/logo.jpg')}
          style={styles.image}
        />
      </View>
      
      {/* Mensagem */}
      <Text style={styles.message}>Allow Bluetooth to find and connect to nearby devices?</Text>
      
      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.allowButton]}
        >
          <Text style={styles.buttonText}>Allow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 40,
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  allowButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});