'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';
import { api, apiUtils } from '@/lib/api';
import { Expense, Category } from '@/types';

interface ExpenseListProps {
  onEditExpense?: (expense: Expense) => void;
  refreshTrigger?: number;
}

export default function ExpenseList({ onEditExpense, refreshTrigger }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger]);

  useEffect(() => {
    filterAndSortExpenses();
  }, [expenses, searchTerm, selectedCategory, sortBy, sortOrder]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const expensesData = await api.expenses.getAll();
      setExpenses(expensesData);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await api.categories.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const filterAndSortExpenses = () => {
    let filtered = [...expenses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(expense => 
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.payee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(expense => expense.categoryId === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredExpenses(filtered);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await api.expenses.delete(expenseId);
      toast.success('Expense deleted successfully');
      fetchExpenses(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete expense');
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.categoryId === categoryId) || 
           { icon: '💰', color: '#6366F1' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input pr-10"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            <FunnelIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'category')}
              className="input"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="category">Sort by Category</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn btn-outline px-3"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg font-medium">No expenses found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payee
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map((expense) => {
                  const categoryInfo = getCategoryInfo(expense.categoryId);
                  return (
                    <tr key={expense.expenseId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {apiUtils.formatDate(expense.date)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {apiUtils.formatTime(expense.time)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: categoryInfo.color + '20', 
                            color: categoryInfo.color 
                          }}
                        >
                          <span className="mr-1">{categoryInfo.icon}</span>
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {expense.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.payee || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {apiUtils.formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          {onEditExpense && (
                            <button
                              onClick={() => onEditExpense(expense)}
                              className="text-primary-600 hover:text-primary-900 transition-colors"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteExpense(expense.expenseId)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </div>
          <div className="text-sm font-medium text-gray-900">
            Total: {apiUtils.formatCurrency(
              filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

