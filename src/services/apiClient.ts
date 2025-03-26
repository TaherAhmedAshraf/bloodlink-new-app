import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';
import toast from '../utils/toast';
import { reset } from '../navigation/navigationRef';
import { AuthProvider } from '../context/AuthContext';

// API base URL
const API_BASE_URL = 'http://192.168.1.217:8080/api';

// Session expired event name
const SESSION_EXPIRED_EVENT = 'bloodlink:session_expired';

// Flag to prevent multiple 401 toasts
let isHandlingAuthError = false;

class ApiClient {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Request interceptor for adding auth token
    this.api.interceptors.request.use(
      async (config) => {
        if (!this.token) {
          this.token = await AsyncStorage.getItem('auth_token');
        }
        
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for handling errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          // Prevent showing multiple toasts for multiple failed requests
          if (!isHandlingAuthError) {
            isHandlingAuthError = true;
            
            // Token expired or invalid
            this.token = null;
            await AsyncStorage.removeItem('auth_token');
            
            // Show toast notification for session expiration
            toast.error('Session Expired', 'Please log in again to continue.');
            
            // Trigger session expired event
            DeviceEventEmitter.emit(SESSION_EXPIRED_EVENT);
            
            // Reset handling flag after a delay
            setTimeout(() => {
              isHandlingAuthError = false;
            }, 1000);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Set auth token manually
  public setToken(token: string): void {
    this.token = token;
    AsyncStorage.setItem('auth_token', token);
  }

  // Clear auth token
  public clearToken(): void {
    this.token = null;
    AsyncStorage.removeItem('auth_token');
  }

  // Generic GET request
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic POST request
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic PUT request
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.put(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic DELETE request
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.delete(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Error handler
  private handleError(error: any): void {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      console.error('Status:', error.response.status);
      
      // Don't show generic errors for auth errors, they are handled in the interceptor
      if (error.response.status !== 401) {
        const errorMessage = error.response.data.message || 'An error occurred';
        toast.error('Request Failed', errorMessage);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
      toast.error('Network Error', 'Please check your internet connection and try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Message:', error.message);
      toast.error('Error', error.message || 'An unexpected error occurred.');
    }
  }
}

// Create a singleton instance
const apiClient = new ApiClient();
export default apiClient; 