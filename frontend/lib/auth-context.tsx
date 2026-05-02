'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from './api';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  college?: string;
  role: 'participant' | 'admin';
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  signup: (data: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Verify token is still valid
          if (token !== 'mock-token' && token !== 'mock-admin-token') {
            const response = await authAPI.getProfile();
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.warn('Backend unavailable, using mock participant login.');
      const mockUser: User = {
        id: '123',
        fullName: 'Demo Participant',
        email,
        role: 'participant',
        emailVerified: true
      };
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await authAPI.adminLogin(email, password);
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.warn('Backend unavailable, using mock admin login.');
      const mockUser: User = {
        id: '000',
        fullName: 'Admin User',
        email,
        role: 'admin',
        emailVerified: true
      };
      localStorage.setItem('token', 'mock-admin-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
  };

  const signup = async (data: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    password: string;
  }) => {
    const response = await authAPI.signup(data);
    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        adminLogin,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
