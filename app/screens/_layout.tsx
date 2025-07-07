import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Componente personalizado para o ícone com barrinha
const TabIconWithIndicator = ({ icon, focused, size = 24 }: { icon: React.ReactNode, focused: boolean, size?: number }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {focused && (
        <View 
          style={{
            position: 'absolute',
            top: -8,
            width: size + 8,
            height: 3,
            backgroundColor: '#1A324F',
            borderRadius: 3,
          }}
        />
      )}
      {icon}
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1A324F',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 0,
          ...Platform.select({
            ios: {
              position: 'absolute',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            android: {
              height: 60,
            },
          }),
        },
        tabBarItemStyle: {
          ...Platform.select({
            ios: {
              paddingBottom: 4,
            },
            android: {
              paddingBottom: 0,
            },
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithIndicator
              focused={focused}
              icon={<IconSymbol size={28} name="house.fill" color={color} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="connection"
        options={{
          title: 'Connection',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithIndicator
              focused={focused}
              size={24}
              icon={<MaterialCommunityIcons name="car-connected" size={24} color={color} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="statistic"
        options={{
          title: 'Statistic',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithIndicator
              focused={focused}
              size={20}
              icon={<Entypo name="circular-graph" size={20} color={color} />}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIconWithIndicator
              focused={focused}
              size={24}
              icon={<Ionicons name="settings-sharp" size={24} color={color} />}
            />
          ),
        }}
      />
    </Tabs>
  );
}