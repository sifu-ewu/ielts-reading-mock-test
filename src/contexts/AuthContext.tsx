import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  preferences: {
    targetBand: number;
    practiceReminders: boolean;
    darkMode: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and validate
    const storedUser = localStorage.getItem('ielts-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('ielts-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    // For demo purposes, we'll simulate authentication
    if (email && password) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        preferences: {
          targetBand: 7,
          practiceReminders: true,
          darkMode: false
        }
      };
      setUser(newUser);
      localStorage.setItem('ielts-user', JSON.stringify(newUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    // In a real app, this would make an API call
    if (email && password && name) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        createdAt: new Date(),
        preferences: {
          targetBand: 7,
          practiceReminders: true,
          darkMode: false
        }
      };
      setUser(newUser);
      localStorage.setItem('ielts-user', JSON.stringify(newUser));
    } else {
      throw new Error('All fields are required');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ielts-user');
    localStorage.removeItem('ielts-test-history');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('ielts-user', JSON.stringify(updatedUser));
  };

  const updatePreferences = async (preferences: Partial<User['preferences']>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...preferences }
    };
    setUser(updatedUser);
    localStorage.setItem('ielts-user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    updatePreferences
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};