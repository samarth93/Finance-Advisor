'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import RegisterForm from '@/components/auth/RegisterForm';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('authToken') || 
                 document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
    
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleAuthSuccess = (token: string) => {
    // Set cookie for middleware
    document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
    
    // Use router.push with replace to ensure proper navigation
    router.replace('/dashboard');
  };

  const handleSwitchToLogin = () => {
    router.push('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <RegisterForm
        onSuccess={handleAuthSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </motion.div>
  );
}