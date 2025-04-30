import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import api from './api';
import socketClient from './socketClient';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin';
  discordUsername?: string;
  walletBalance?: number;
  cryptoAddress?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, discordUsername?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the socket connection when user changes
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (user && token) {
      // Initialize socket connection with the token
      socketClient.init(token);
    } else {
      // Disconnect socket when user logs out
      socketClient.disconnect();
    }

    // Cleanup on unmount
    return () => {
      socketClient.disconnect();
    };
  }, [user]);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Optionally refresh the user profile in the background
        updateProfile().catch(console.error);
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Update user profile from API
  const updateProfile = async (): Promise<void> => {
    if (!user) return;

    try {
      const response = await api.get('/users/profile');
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (e) {
      console.error('Failed to update user profile', e);
      // Don't clear user data on profile update failure
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Call the real API endpoint
      const response = await api.post('/auth/login', { email, password });

      if (response.data) {
        const { token, user: userData } = response.data;

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);

        // Show success toast
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
          variant: 'default'
        });

        return true;
      } else {
        throw new Error('Login failed');
      }
    } catch (e) {
      console.error('Login error details:', e);

      if (e instanceof Error) {
        // Handle axios error with response
        if (e.name === 'AxiosError' && (e as any).response) {
          const axiosError = e as any;
          const errorMessage = axiosError.response.data?.message || axiosError.message;
          setError(errorMessage);
          toast({
            title: 'Login Failed',
            description: errorMessage,
            variant: 'destructive'
          });
        } else {
          // Handle regular Error
          setError(e.message);
          toast({
            title: 'Login Failed',
            description: e.message,
            variant: 'destructive'
          });
        }
      } else {
        // Handle unknown error
        setError('An unknown error occurred');
        toast({
          title: 'Login Failed',
          description: 'An unknown error occurred',
          variant: 'destructive'
        });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, discordUsername?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Call the real API endpoint
      const response = await api.post('/auth/signup', { name, email, password, discordUsername });

      if (response.data) {
        const { token, user: userData } = response.data;

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);

        // Show success toast
        toast({
          title: 'Account created successfully',
          description: 'Welcome to TradeChampionX!',
          variant: 'default'
        });

        return true;
      } else {
        throw new Error('Signup failed');
      }
    } catch (e) {
      console.error('Signup error details:', e);

      if (e instanceof Error) {
        // Handle axios error with response
        if (e.name === 'AxiosError' && (e as any).response) {
          const axiosError = e as any;
          const errorMessage = axiosError.response.data?.message || axiosError.message;
          setError(errorMessage);
          toast({
            title: 'Signup Failed',
            description: errorMessage,
            variant: 'destructive'
          });
        } else {
          // Handle regular Error
          setError(e.message);
          toast({
            title: 'Signup Failed',
            description: e.message,
            variant: 'destructive'
          });
        }
      } else {
        // Handle unknown error
        setError('An unknown error occurred');
        toast({
          title: 'Signup Failed',
          description: 'An unknown error occurred',
          variant: 'destructive'
        });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    socketClient.disconnect();
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}