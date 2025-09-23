'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import ExpenseList from '@/components/expenses/ExpenseList';
import AddExpenseForm from '@/components/forms/AddExpenseForm';
import { toast } from 'react-hot-toast';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default function ExpensesPage() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowAddExpense(false);
    toast.success('Expense added successfully!');
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600">Manage and track your expenses</p>
          </div>
          <button 
            onClick={() => setShowAddExpense(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Expense List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <ExpenseList refreshTrigger={refreshTrigger} />
        </div>
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