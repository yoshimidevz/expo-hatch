// src/navigation/AppNavigator.tsx
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/contexts/authContext';
import LoginScreen from '@/app/login';
import HomeScreen from '@/app/(tabs)/index';
import ProfileScreen from '@/app/(tabs)/settings';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
          }}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ tabBarLabel: 'Início' }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ tabBarLabel: 'Perfil' }}
          />
        </Tab.Navigator>
      ) : (
        <LoginScreen onLoginSuccess={function (): void {
                      throw new Error('Function not implemented.');
                  } } />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;