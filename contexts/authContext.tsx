// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import authService, { User, LoginCredentials, ApiError } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User } }
  | { type: 'AUTH_ERROR'; payload: { error: string } }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload.error,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        const userData = await authService.getUserData();
        if (userData) {
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { user: userData } 
          });
        } else {
          dispatch({ 
            type: 'AUTH_ERROR', 
            payload: { error: 'Dados do usuário não encontrados' } 
          });
        }
      } else {
        dispatch({ 
          type: 'AUTH_ERROR', 
          payload: { error: 'Usuário não autenticado' } 
        });
      }
    } catch (error) {
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: { error: 'Erro ao verificar autenticação' } 
      });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      
      const response = await authService.login(credentials);
      
      if (response.success && response.data.user) {
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user: response.data.user } 
        });
        return true;
      } else {
        dispatch({ 
          type: 'AUTH_ERROR', 
          payload: { error: 'Falha no login' } 
        });
        return false;
      }
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: { error: apiError.message || 'Erro ao fazer login' } 
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      dispatch({ type: 'AUTH_LOGOUT' });
      console.error('Erro ao fazer logout:', error);
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    clearError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};