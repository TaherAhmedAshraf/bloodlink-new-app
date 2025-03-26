import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services';
import toast from '../utils/toast';
import { reset } from '../navigation/navigationRef';

// Define the shape of our auth context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: (showToast?: boolean) => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  checkAuthStatus: async () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is logged in on initial load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check if the user is authenticated
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('auth_token');
      
      if (token) {
        // Set the token in the API client
        apiClient.setToken(token);
        setIsAuthenticated(true);
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to log in
  const login = async (token: string): Promise<void> => {
    try {
      setIsLoading(true);
      // Store the token
      await AsyncStorage.setItem('auth_token', token);
      // Set the token in the API client
      apiClient.setToken(token);
      setIsAuthenticated(true);
      toast.success('Login Successful', 'Welcome to BloodLink!');
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Login Failed', 'An error occurred while logging in.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to log out
  const logout = async (showToast: boolean = true): Promise<void> => {
    try {
      setIsLoading(true);
      // Remove the token
      await AsyncStorage.removeItem('auth_token');
      // Clear the token in the API client
      apiClient.clearToken();
      setIsAuthenticated(false);
      
      if (showToast) {
        toast.info('Logged Out', 'You have been successfully logged out.');
      }
      
      // Navigate to Login screen
      reset('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      if (showToast) {
        toast.error('Logout Failed', 'An error occurred while logging out.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Value object that will be passed to consumers
  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 