import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Link, router } from 'expo-router';
import AuthService from '@/services/authService';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert('Erro', 'As senhas não conferem.');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      // Verificar se o cadastro foi bem-sucedido
      if (response.status === "success" || response.status_code === 200) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              // Redireciona para a tela home dentro das tabs
              router.replace('/(tabs)/home');
            },
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F5F5F5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 24,
            elevation: 4,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 24,
              textAlign: 'center',
              color: '#333',
            }}
          >
            Criar Conta
          </Text>

          <TextInput
            placeholder="Nome completo"
            value={name}
            onChangeText={setName}
            editable={!loading}
            placeholderTextColor="#888"
            style={{
              borderWidth: 1,
              borderColor: '#DDD',
              borderRadius: 8,
              padding: 14,
              marginBottom: 16,
              backgroundColor: '#FAFAFA',
            }}
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            placeholderTextColor="#888"
            style={{
              borderWidth: 1,
              borderColor: '#DDD',
              borderRadius: 8,
              padding: 14,
              marginBottom: 16,
              backgroundColor: '#FAFAFA',
            }}
          />

          <TextInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
            placeholderTextColor="#888"
            style={{
              borderWidth: 1,
              borderColor: '#DDD',
              borderRadius: 8,
              padding: 14,
              marginBottom: 16,
              backgroundColor: '#FAFAFA',
            }}
          />

          <TextInput
            placeholder="Confirmar Senha"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
            placeholderTextColor="#888"
            style={{
              borderWidth: 1,
              borderColor: '#DDD',
              borderRadius: 8,
              padding: 14,
              marginBottom: 24,
              backgroundColor: '#FAFAFA',
            }}
          />

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#A5D6A7' : '#34A853',
              borderRadius: 8,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Cadastrar
              </Text>
            )}
          </TouchableOpacity>

          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <Text style={{ color: '#666', marginBottom: 4 }}>
              Já tem uma conta?
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={{ color: '#007AFF', fontWeight: '600' }}>
                  Entrar aqui
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}