// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      direction: string;
      property: string;
    };
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: User;
  message: string;
}

export interface TokenValidationRequest {
  token: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  message: string;
  user?: User;
}

// User Types
export interface User {
  id?: string;
  userId: string;
  name: string;
  email: string;
  role?: string;
  emailVerified?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
}

export interface UserStats {
  userId: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  categoryCount: number;
  expenseCount?: number;
  totalExpenses?: number;
}

// Category Types
export interface Category {
  id?: string;
  categoryId: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

// Expense Types
export interface Expense {
  id?: string;
  expenseId: string;
  userId: string;
  amount: number;
  category: string;
  categoryId: string;
  date: string;
  time: string;
  payee?: string;
  description?: string;
  paymentMethod?: string;
  tags?: string[];
  location?: string;
  isRecurring: boolean;
  recurringFrequency?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  source: string;
}

export interface ExpenseRequest {
  amount: number;
  category: string;
  categoryId?: string;
  date: string;
  time: string;
  payee?: string;
  description?: string;
  paymentMethod?: string;
  tags?: string[];
  location?: string;
  isRecurring?: boolean;
  recurringFrequency?: string;
  notes?: string;
}

// Expense Summary Types
export interface ExpenseSummary {
  userId: string;
  period: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  totalExpenses: number;
  averageExpense: number;
  categoryBreakdown: CategorySummary[];
  monthlyTrends: MonthlySummary[];
  topCategory?: string;
  topCategoryAmount?: number;
  topPayees?: string[];
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface MonthlySummary {
  monthYear: string;
  amount: number;
  count: number;
  averageDaily: number;
}

// Enums
export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  UPI = 'UPI',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET',
}

export enum RecurringFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum ExpenseSource {
  MANUAL = 'MANUAL',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  BANK_API = 'BANK_API',
}

export enum Period {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

// Form Types
export interface ExpenseFormData {
  amount: string;
  categoryId: string;
  date: string;
  time: string;
  payee: string;
  description: string;
  paymentMethod: PaymentMethod;
  tags: string[];
  location: string;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  notes: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  icon?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  amount: number;
  count: number;
}

// Filter Types
export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
  payee?: string;
  paymentMethod?: PaymentMethod;
  tags?: string[];
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FormState<T> extends LoadingState {
  data: T;
  isDirty: boolean;
  isValid: boolean;
}

// Error Types
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path?: string;
  details?: Record<string, string>;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  active?: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalExpenses: number;
  currentMonthTotal: number;
  previousMonthTotal: number;
  averageDaily: number;
  topCategory: string;
  recentExpensesCount: number;
}

// Color Palette for Charts
export const CHART_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#f59e0b', // yellow
  '#10b981', // green
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6b7280', // gray
  '#14b8a6', // teal
  '#f97316', // orange
  '#84cc16', // lime
];

// Default Categories Data
export const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: '🍽️', color: '#ef4444' },
  { name: 'Shopping', icon: '🛒', color: '#f59e0b' },
  { name: 'Travel', icon: '✈️', color: '#10b981' },
  { name: 'Bills', icon: '📄', color: '#8b5cf6' },
  { name: 'Entertainment', icon: '🎬', color: '#ec4899' },
  { name: 'Others', icon: '📦', color: '#6b7280' },
];

// Payment Methods Display Names
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CREDIT_CARD]: 'Credit Card',
  [PaymentMethod.DEBIT_CARD]: 'Debit Card',
  [PaymentMethod.CASH]: 'Cash',
  [PaymentMethod.UPI]: 'UPI',
  [PaymentMethod.NET_BANKING]: 'Net Banking',
  [PaymentMethod.WALLET]: 'Digital Wallet',
};
