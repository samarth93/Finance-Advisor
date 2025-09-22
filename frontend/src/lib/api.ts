import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import {
  User,
  Category,
  Expense,
  ExpenseSummary,
  CreateUserRequest,
  UpdateUserRequest,
  CategoryRequest,
  ExpenseRequest,
  UserStats,
  PaginatedResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TokenValidationRequest,
  TokenValidationResponse,
} from '@/types';

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      const errorMessage = getErrorMessage(error);
      
      // Don't show toast for certain status codes or during initialization
      const shouldShowToast = !(
        error.response?.status === 404 || // Not found
        error.response?.status === 409 || // Conflict (user already exists)
        error.config?.url?.includes('/users/') // User-related requests during initialization
      );
      
      if (shouldShowToast) {
        toast.error(errorMessage);
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Initialize API client
const apiClient = createApiClient();

// Error handling utility
const getErrorMessage = (error: AxiosError): string => {
  if (error.response?.data) {
    const errorData = error.response.data as any;
    
    if (errorData.message) {
      return errorData.message;
    }
    
    if (errorData.details && typeof errorData.details === 'object') {
      // Handle validation errors
      const validationErrors = Object.values(errorData.details).join(', ');
      return `Validation error: ${validationErrors}`;
    }
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// API endpoints
export const api = {
  // Authentication endpoints
  auth: {
    register: async (registerData: RegisterRequest): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>('/auth/register', registerData);
      return response.data;
    },

    login: async (loginData: LoginRequest): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>('/auth/login', loginData);
      return response.data;
    },

    validate: async (validationData: TokenValidationRequest): Promise<TokenValidationResponse> => {
      const response = await apiClient.post<TokenValidationResponse>('/auth/validate', validationData);
      return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    },

    logout: async (): Promise<void> => {
      await apiClient.post('/auth/logout');
    },
  },

  // User endpoints
  users: {
    create: async (userData: CreateUserRequest): Promise<User> => {
      const response = await apiClient.post<User>('/users', userData);
      return response.data;
    },

    getById: async (userId: string): Promise<User> => {
      const response = await apiClient.get<User>(`/users/${userId}`);
      return response.data;
    },

    getByEmail: async (email: string): Promise<User> => {
      const response = await apiClient.get<User>(`/users/by-email?email=${encodeURIComponent(email)}`);
      return response.data;
    },

    update: async (userId: string, userData: UpdateUserRequest): Promise<User> => {
      const response = await apiClient.put<User>(`/users/${userId}`, userData);
      return response.data;
    },

    delete: async (userId: string): Promise<void> => {
      await apiClient.delete(`/users/${userId}`);
    },

    deactivate: async (userId: string): Promise<User> => {
      const response = await apiClient.put<User>(`/users/${userId}/deactivate`);
      return response.data;
    },

    reactivate: async (userId: string): Promise<User> => {
      const response = await apiClient.put<User>(`/users/${userId}/reactivate`);
      return response.data;
    },

    getActiveUsers: async (): Promise<User[]> => {
      const response = await apiClient.get<User[]>('/users/active');
      return response.data;
    },

    exists: async (userId: string): Promise<boolean> => {
      const response = await apiClient.get<boolean>(`/users/${userId}/exists`);
      return response.data;
    },

    getStats: async (userId: string): Promise<UserStats> => {
      const response = await apiClient.get<UserStats>(`/users/${userId}/stats`);
      return response.data;
    },
  },

  // Category endpoints
  categories: {
    create: async (categoryData: CategoryRequest): Promise<Category> => {
      const response = await apiClient.post<Category>('/categories', categoryData);
      return response.data;
    },

    getAll: async (): Promise<Category[]> => {
      const response = await apiClient.get<Category[]>('/categories');
      return response.data;
    },

    getById: async (categoryId: string): Promise<Category> => {
      const response = await apiClient.get<Category>(`/categories/details/${categoryId}`);
      return response.data;
    },

    update: async (categoryId: string, categoryData: CategoryRequest): Promise<Category> => {
      const response = await apiClient.put<Category>(`/categories/${categoryId}`, categoryData);
      return response.data;
    },

    delete: async (categoryId: string): Promise<void> => {
      await apiClient.delete(`/categories/${categoryId}`);
    },

    getDefaults: async (userId: string): Promise<Category[]> => {
      const response = await apiClient.get<Category[]>(`/categories/${userId}/defaults`);
      return response.data;
    },

    search: async (userId: string, query: string): Promise<Category[]> => {
      const response = await apiClient.get<Category[]>(`/categories/${userId}/search?query=${encodeURIComponent(query)}`);
      return response.data;
    },

    initializeDefaults: async (userId: string): Promise<Category[]> => {
      const response = await apiClient.post<Category[]>(`/categories/${userId}/initialize-defaults`);
      return response.data;
    },

    getCount: async (userId: string): Promise<number> => {
      const response = await apiClient.get<number>(`/categories/${userId}/count`);
      return response.data;
    },
  },

  // Expense endpoints
  expenses: {
    create: async (expenseData: ExpenseRequest): Promise<Expense> => {
      const response = await apiClient.post<Expense>('/expenses', expenseData);
      return response.data;
    },

    getAll: async (): Promise<Expense[]> => {
      const response = await apiClient.get<Expense[]>('/expenses');
      return response.data;
    },

    getPaginated: async (
      page: number = 0,
      size: number = 20,
      sortBy: string = 'date',
      sortDir: string = 'desc'
    ): Promise<PaginatedResponse<Expense>> => {
      const response = await apiClient.get<PaginatedResponse<Expense>>(
        `/expenses/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
      );
      return response.data;
    },

    getById: async (expenseId: string): Promise<Expense> => {
      const response = await apiClient.get<Expense>(`/expenses/details/${expenseId}`);
      return response.data;
    },

    update: async (expenseId: string, expenseData: ExpenseRequest): Promise<Expense> => {
      const response = await apiClient.put<Expense>(`/expenses/${expenseId}`, expenseData);
      return response.data;
    },

    delete: async (expenseId: string): Promise<void> => {
      await apiClient.delete(`/expenses/${expenseId}`);
    },

    getSummary: async (
      period: string = 'MONTHLY',
      startDate?: string,
      endDate?: string
    ): Promise<ExpenseSummary> => {
      let url = `/expenses/summary?period=${period}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      
      const response = await apiClient.get<ExpenseSummary>(url);
      return response.data;
    },

    getByDateRange: async (startDate: string, endDate: string): Promise<Expense[]> => {
      const response = await apiClient.get<Expense[]>(
        `/expenses/date-range?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    },

    getByCategory: async (category: string): Promise<Expense[]> => {
      const response = await apiClient.get<Expense[]>(`/expenses/category/${encodeURIComponent(category)}`);
      return response.data;
    },

    search: async (query: string): Promise<Expense[]> => {
      const response = await apiClient.get<Expense[]>(`/expenses/search?query=${encodeURIComponent(query)}`);
      return response.data;
    },

    getRecent: async (days: number = 7): Promise<Expense[]> => {
      const response = await apiClient.get<Expense[]>(`/expenses/recent?days=${days}`);
      return response.data;
    },
  },
};

// Utility functions
export const apiUtils = {
  // Check API health
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/actuator/health');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },

  // Format currency
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  },

  // Format date
  formatDate: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Format time
  formatTime: (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  },

  // Get relative time
  getRelativeTime: (date: string | Date): string => {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  },
};

export default api;
