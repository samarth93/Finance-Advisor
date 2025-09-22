'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';

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
          const token = localStorage.getItem('authToken');
          if (token) {
            const response = await api.auth.validate({ token });
            if (response.valid) {
              onAuthenticated(token);
              return;
            }
          }
        } catch (error) {
          // Token is invalid, remove it
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
      </div>
    </div>
  );
}