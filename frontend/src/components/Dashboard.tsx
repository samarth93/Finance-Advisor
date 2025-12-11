'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  UserIcon,
  PowerIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import AddExpenseForm from '@/components/forms/AddExpenseForm';
import ExpenseList from '@/components/expenses/ExpenseList';
import CategoryManager from '@/components/categories/CategoryManager';
import Analytics from '@/components/analytics/Analytics';
import { api, apiUtils } from '@/lib/api';
import { User, ExpenseSummary } from '@/types';

interface DashboardProps {
  authToken: string | null;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Dashboard({ authToken }: DashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'expenses' | 'categories' | 'analytics'>('dashboard');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (authToken) {
      initializeUser();
    }
  }, [authToken]);

  useEffect(() => {
    if (user && currentView === 'dashboard') {
      fetchDashboardData();
    }
  }, [user, refreshTrigger, currentView]);

  const initializeUser = async () => {
    try {
      setIsLoading(true);
      const userData = await api.auth.getCurrentUser();
      setUser(userData);
      
      // Initialize default categories if needed
      try {
        const categories = await api.categories.getAll();
        if (categories.length === 0) {
          // Create some default categories
          const defaultCategories = [
            { name: 'Food & Dining', description: 'Restaurants, groceries, and food delivery', icon: '🍽️' },
            { name: 'Transportation', description: 'Gas, public transport, ride-sharing', icon: '🚗' },
            { name: 'Entertainment', description: 'Movies, games, subscriptions', icon: '🎬' },
            { name: 'Utilities', description: 'Electricity, water, internet, phone', icon: '💡' },
            { name: 'Healthcare', description: 'Medical expenses, pharmacy, insurance', icon: '🏥' },
            { name: 'Shopping', description: 'Clothing, electronics, household items', icon: '🛍️' }
          ];
          
          for (const category of defaultCategories) {
            await api.categories.create(category);
          }
          console.log('Initialized default categories');
        }
      } catch (error) {
        console.warn('Could not initialize categories:', error);
      }
      
    } catch (error: any) {
      console.error('Failed to initialize user:', error);
      toast.error('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      const summaryData = await api.expenses.getSummary('MONTHLY');
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Don't show error for empty data
    }
  };

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Expense added successfully!');
  };

  const handleCategoryChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.reload();
    }
  };

  const getStats = () => {
    if (!summary) return { totalAmount: 0, totalExpenses: 0, averageExpense: 0 };
    return {
      totalAmount: summary.totalAmount,
      totalExpenses: summary.totalExpenses,
      averageExpense: summary.averageExpense,
    };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your expense tracker...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!user) return null;

    switch (currentView) {
      case 'expenses':
        return <ExpenseList refreshTrigger={refreshTrigger} />;
      case 'categories':
        return <CategoryManager onCategoryChange={handleCategoryChange} />;
      case 'analytics':
        return <Analytics />;
      case 'dashboard':
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
    return (
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        {/* Welcome Section */}
        <motion.div variants={fadeIn} className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Here's your expense overview for this month
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {/* Total Expenses */}
          <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  {apiUtils.formatCurrency(stats.totalAmount)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Total Count */}
          <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalExpenses}</p>
              </div>
            </div>
          </motion.div>

          {/* Average Expense */}
          <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sm:col-span-2 lg:col-span-1 transition-colors duration-300">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Average Expense</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  {apiUtils.formatCurrency(stats.averageExpense)}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeIn} className="mb-6 sm:mb-8">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button 
              onClick={() => setShowAddExpense(true)}
              className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left group min-h-[100px] sm:min-h-[120px]"
            >
              <PlusIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Add Expense</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Record a new expense</p>
            </button>

            <button 
              onClick={() => setCurrentView('expenses')}
              className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500 hover:shadow-md transition-all duration-200 text-left group min-h-[100px] sm:min-h-[120px]"
            >
              <ChartBarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">View Expenses</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Browse all expenses</p>
            </button>

            <button 
              onClick={() => setCurrentView('categories')}
              className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-500 hover:shadow-md transition-all duration-200 text-left group min-h-[100px] sm:min-h-[120px]"
            >
              <TagIcon className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 dark:text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Categories</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Manage categories</p>
            </button>

            <button 
              onClick={() => setCurrentView('analytics')}
              className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md transition-all duration-200 text-left group min-h-[100px] sm:min-h-[120px]"
            >
              <ArrowTrendingUpIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">Analytics</h4>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">View insights</p>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        {summary && summary.totalExpenses > 0 && (
          <motion.div variants={fadeIn} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">Category Breakdown</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {summary.categoryBreakdown?.slice(0, 5).map((category) => (
                  <div key={category.categoryId} className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <span className="text-base sm:text-lg mr-2 flex-shrink-0">{category.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">{category.categoryName}</span>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        {apiUtils.formatCurrency(category.amount)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {category.count} expenses • {category.percentage?.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Expense Tracker</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddExpense(true)}
                className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Expense</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2 transition-colors"
                  title="Logout"
                >
                  <PowerIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
              { key: 'expenses', label: 'Expenses', icon: CurrencyDollarIcon },
              { key: 'categories', label: 'Categories', icon: TagIcon },
              { key: 'analytics', label: 'Analytics', icon: ArrowTrendingUpIcon },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentView === key
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Add Expense Modal */}
      <AddExpenseForm
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSuccess={handleExpenseAdded}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Expense Tracker v1.0.0</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Built with ❤️ using Spring Boot & Next.js
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}