'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserRole, ApiResponse } from '../types';
import api from '../lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

interface RegisterData {
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state from stored tokens
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (token && refreshToken) {
        try {
          // Verify token and get current user
          const response = await api.get<ApiResponse<User>>('/auth/me');
          if (response.data.success && response.data.data) {
            setState({
              user: response.data.data,
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          }
        } catch (error) {
          // Token invalid, try refresh
          const refreshed = await refreshTokenInternal();
          if (!refreshed) {
            clearAuthData();
          }
        }
      }

      setState(prev => ({ ...prev, isLoading: false }));
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const setAuthData = (authResponse: AuthResponse) => {
    localStorage.setItem('auth_token', authResponse.tokens.accessToken);
    localStorage.setItem('refresh_token', authResponse.tokens.refreshToken);
    setState({
      user: authResponse.user,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const refreshTokenInternal = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return false;

      const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh-token', {
        refreshToken,
      });

      if (response.data.success && response.data.data) {
        setAuthData(response.data.data);
        return true;
      }
      return false;
    } catch (error) {
      clearAuthData();
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
        email,
        password,
      });

      if (response.data.success && response.data.data) {
        setAuthData(response.data.data);
        return { success: true, message: 'Login successful' };
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);

      if (response.data.success && response.data.data) {
        setAuthData(response.data.data);
        return { success: true, message: 'Registration successful' };
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return { success: false, message: response.data.message || 'Registration failed' };
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with client-side logout even if server call fails
      console.warn('Server logout failed:', error);
    } finally {
      clearAuthData();
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    return refreshTokenInternal();
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};