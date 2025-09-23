'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
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
      
      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  );
}