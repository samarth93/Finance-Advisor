'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { api } from '@/lib/api';

interface AuthWrapperProps {
  onAuthenticated: (token: string) => void;
}

export default function AuthWrapper({ onAuthenticated }: AuthWrapperProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkExistingAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await api.auth.validate({ token });
          if (response.valid) {
            onAuthenticated(token);
            return;
          }
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkExistingAuth();
  }, [onAuthenticated]);

  const handleAuthSuccess = (token: string) => {
    onAuthenticated(token);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-700"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-indigo-200/20 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
            ></motion.div>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 font-medium text-lg"
          >
            Checking authentication...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0] 
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1 
          }}
          className="absolute top-1/3 right-20 w-32 h-32 bg-purple-200/25 rounded-full blur-2xl"
        />
        <motion.div 
          animate={{ 
            x: [0, 20, 0],
            y: [0, -15, 0] 
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2 
          }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-200/30 rounded-full blur-xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -25, 0],
            y: [0, 20, 0] 
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5 
          }}
          className="absolute bottom-10 right-10 w-16 h-16 bg-indigo-200/35 rounded-full blur-lg"
        />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <motion.div
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {isLogin ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onSwitchToRegister={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}