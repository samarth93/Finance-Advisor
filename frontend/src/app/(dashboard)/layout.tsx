'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  CurrencyDollarIcon,
  TagIcon,
  ChartBarIcon,
  UserIcon,
  PowerIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { User } from '@/types';
import ThemeToggleButton from '@/components/ui/ThemeToggleButton';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Expenses', href: '/expenses', icon: CurrencyDollarIcon },
  { name: 'Categories', href: '/categories', icon: TagIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initializeUser();
  }, []);

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
        handleLogout();
        return;
      }

      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth validation failed:', error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    toast.success('Logged out successfully');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-200 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl lg:shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0 border-r border-gray-200 dark:border-gray-700`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 sm:h-18 px-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10 flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <CurrencyDollarIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">Finance Advisor</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden relative z-10 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 sm:px-5 py-6 sm:py-8 space-y-2 overflow-y-auto">
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                Navigation
              </p>
            </div>
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.button
                key={item.name}
                onClick={() => {
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`group w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 min-h-[48px] relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-gray-700/25'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div className={`flex items-center relative z-10 ${isActive ? 'text-white' : ''}`}>
                  <div className={`p-2 rounded-lg mr-3 transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                  }`}>
                    <item.icon className={`w-5 h-5 transition-colors duration-200 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`} />
                  </div>
                  <span className="truncate font-medium">{item.name}</span>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-4 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 flex-shrink-0">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <UserIcon className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
          
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 min-h-[48px] border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700"
          >
            <div className="p-2 rounded-lg mr-3 bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors duration-200">
              <PowerIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="font-medium">Logout</span>
            <motion.div
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              whileHover={{ x: 2 }}
            >
              →
            </motion.div>
          </motion.button>
        </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize truncate">
                  {pathname.split('/').pop() || 'Dashboard'}
                </h2>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <ThemeToggleButton />
                <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400 truncate">
                  Welcome, {user?.name || 'User'}
                </span>
                <div className="sm:hidden w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 pb-16 lg:pb-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Mobile bottom navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-40 transition-colors duration-300 shadow-2xl">
          <div className="grid grid-cols-4 gap-1 px-2 py-2 safe-area-pb">
            {navigation.slice(0, 4).map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex flex-col items-center justify-center py-2 px-1 text-xs font-medium rounded-xl transition-all duration-200 min-h-[60px] ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveTab"
                      className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className={`relative z-10 p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-100 dark:bg-blue-900/30 scale-110' 
                      : 'bg-transparent'
                  }`}>
                    <item.icon className={`w-5 h-5 transition-colors duration-200 ${
                      isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  <span className={`truncate mt-1 relative z-10 transition-all duration-200 ${
                    isActive ? 'font-semibold' : ''
                  }`}>{item.name}</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute bottom-1 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}