'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CategoryManager from '@/components/categories/CategoryManager';
import { toast } from 'react-hot-toast';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default function CategoriesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCategoryChange = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.success('Categories updated successfully!');
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeIn}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Categories</h1>
        <p className="text-gray-600 dark:text-gray-400">Organize your expenses with custom categories</p>
      </div>

      {/* Category Manager */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
        <CategoryManager onCategoryChange={handleCategoryChange} />
      </div>
    </motion.div>
  );
}