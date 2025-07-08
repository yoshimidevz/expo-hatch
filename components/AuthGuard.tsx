import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AuthService from '@/services/authService';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona para login se o usuário não estiver autenticado
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        // Redireciona para login se não estiver autenticado
        router.replace('/login');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F5F5F5'
      }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Se não estiver autenticado, não renderiza nada (será redirecionado)
  if (!isAuthenticated) {
    return null;
  }

  // Se estiver autenticado, renderiza o conteúdo
  return <>{children}</>;
}

/**
 * Como usar o AuthGuard:
 * 
 * 1. Envolva as telas que precisam de autenticação:
 * 
 * // app/(tabs)/_layout.tsx
 * import AuthGuard from '@/components/AuthGuard';
 * 
 * export default function TabLayout() {
 *   return (
 *     <AuthGuard>
 *       <Tabs>
 *         // suas tabs aqui
 *       </Tabs>
 *     </AuthGuard>
 *   );
 * }
 * 
 * 2. Ou use em telas específicas:
 * 
 * // app/(tabs)/home.tsx
 * import AuthGuard from '@/components/AuthGuard';
 * 
 * export default function HomeScreen() {
 *   return (
 *     <AuthGuard>
 *       // conteúdo da tela home
 *     </AuthGuard>
 *   );
 * }
 */