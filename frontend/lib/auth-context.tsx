'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from './api';

//////////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////
// PROVIDER
//////////////////////////////////////////////////////

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data);
    } catch (err) {
      console.error("No active session or error fetching user:", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  //////////////////////////////////////////////////////
  // 🔐 LOGIN
  //////////////////////////////////////////////////////

  const login = async (email: string, password: string) => {
    try {
      await authAPI.login(email, password);
      await fetchUser(); // Fetch actual user data instead of mocking
    } catch (err: any) {
      console.error("LOGIN FAILED:", err);
      throw new Error(err.response?.data?.detail || "Login failed");
    }
  };

  //////////////////////////////////////////////////////
  // 🛠 ADMIN LOGIN
  //////////////////////////////////////////////////////

  const adminLogin = async (email: string, password: string) => {
    try {
      await authAPI.adminLogin(email, password);
      await fetchUser(); // Fetch actual admin data
    } catch (err: any) {
      console.error("ADMIN LOGIN FAILED:", err);
      throw new Error(err.response?.data?.detail || "Admin login failed");
    }
  };

  //////////////////////////////////////////////////////
  // 📝 SIGNUP
  //////////////////////////////////////////////////////

  const signup = async (data: {
    fullName: string;
    email: string;
    phone: string;
    college: string;
    password: string;
  }) => {
    try {
      await authAPI.signup(data);
      alert("Signup successful. Check your email to verify.");
    } catch (err: any) {
      console.error("SIGNUP FAILED:", err);
      throw new Error(err.response?.data?.detail || "Signup failed");
    }
  };

  //////////////////////////////////////////////////////
  // 🔓 LOGOUT
  //////////////////////////////////////////////////////

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  //////////////////////////////////////////////////////
  // PROVIDER
  //////////////////////////////////////////////////////

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
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//////////////////////////////////////////////////////
// HOOK
//////////////////////////////////////////////////////

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}