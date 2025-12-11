'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Analytics from '@/components/analytics/Analytics';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default function AnalyticsPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeIn}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Insights and trends for your spending habits</p>
      </div>

      {/* Analytics Component */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <Analytics />
      </div>
    </motion.div>
  );
}