'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  TagIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import AddExpenseForm from '@/components/forms/AddExpenseForm';
import { api, apiUtils } from '@/lib/api';
import { User, ExpenseSummary } from '@/types';

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

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, refreshTrigger]);

  const initializeUser = async () => {
    try {
      const token = localStorage.getItem('authToken') || 
                   document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await api.auth.validate({ token });
      if (!response.valid) {
        router.push('/login');
        return;
      }

      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth validation failed:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
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
    setShowAddExpense(false);
    toast.success('Expense added successfully!');
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
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {/* Welcome Section */}
        <motion.div variants={fadeIn}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your expense overview for this month
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Total Expenses */}
          <motion.div variants={fadeIn} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {apiUtils.formatCurrency(stats.totalAmount)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Total Count */}
          <motion.div variants={fadeIn} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalExpenses}</p>
              </div>
            </div>
          </motion.div>

          {/* Average Expense */}
          <motion.div variants={fadeIn} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Expense</p>
                <p className="text-2xl font-bold text-gray-900">
                  {apiUtils.formatCurrency(stats.averageExpense)}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <button 
              onClick={() => setShowAddExpense(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Expense</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.button 
              onClick={() => setShowAddExpense(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Add Expense</h3>
              <p className="text-sm text-gray-500">Record a new expense</p>
            </motion.button>

            <motion.button 
              onClick={() => router.push('/expenses')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">View Expenses</h3>
              <p className="text-sm text-gray-500">Browse all expenses</p>
            </motion.button>

            <motion.button 
              onClick={() => router.push('/categories')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TagIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Categories</h3>
              <p className="text-sm text-gray-500">Manage categories</p>
            </motion.button>

            <motion.button 
              onClick={() => router.push('/analytics')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
              <p className="text-sm text-gray-500">View insights</p>
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        {summary && summary.totalExpenses > 0 && (
          <motion.div variants={fadeIn} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
              <p className="text-sm text-gray-500">Your top spending categories this month</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {summary.categoryBreakdown?.slice(0, 5).map((category) => (
                  <div key={category.categoryId} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">{category.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.categoryName}</p>
                        <p className="text-sm text-gray-500">{category.count} expenses</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {apiUtils.formatCurrency(category.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {category.percentage?.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseForm
          isOpen={showAddExpense}
          onClose={() => setShowAddExpense(false)}
          onSuccess={handleExpenseAdded}
        />
      )}
    </>
  );
}