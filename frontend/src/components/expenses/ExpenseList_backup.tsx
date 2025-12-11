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
    fetchCategories();
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

    if (searchTerm) {
      filtered = filtered.filter(expense => 
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.payee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(expense => expense.categoryId === selectedCategory);
    }

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
      fetchExpenses();
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
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 sm:py-2 text-base sm:text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-300"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 sm:py-2 pl-3 pr-10 text-base sm:text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-300"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <FunnelIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'category')}
                className="flex-1 sm:w-auto appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-3 sm:py-2 pl-3 pr-8 text-base sm:text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-300"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="category">Sort by Category</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 sm:px-4 py-3 sm:py-2 text-base sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300 min-w-[44px]"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <p>No expenses found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date & Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payee
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                {filteredExpenses.map((expense) => {
                  const category = categories.find(c => c.categoryId === expense.categoryId);
                  return (
                    <tr key={expense.expenseId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <span className="text-lg">{category?.icon || '📝'}</span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {new Date(expense.date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {category?.name || 'Uncategorized'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">{expense.description || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{expense.payee || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100">{apiUtils.formatCurrency(expense.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          {onEditExpense && (
                            <button
                              onClick={() => onEditExpense(expense)}
                              className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors p-1"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteExpense(expense.expenseId)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors p-1"
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

          {/* Mobile Card View */}
                          <div>
                            <div className="font-medium">{apiUtils.formatDate(expense.date)}</div>
                            <div className="text-xs text-gray-500">{apiUtils.formatTime(expense.time)}</div>
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
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{expense.description || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.payee || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{apiUtils.formatCurrency(expense.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            {onEditExpense && (
                              <button
                                onClick={() => onEditExpense(expense)}
                                className="text-primary-600 hover:text-primary-900 transition-colors p-1"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteExpense(expense.expenseId)}
                              className="text-red-600 hover:text-red-900 transition-colors p-1"
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

          <div className="sm:hidden space-y-3">
            {filteredExpenses.map((expense) => {
              const categoryInfo = getCategoryInfo(expense.categoryId);
              return (
                <div key={expense.expenseId} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span 
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: categoryInfo.color + '20', 
                          color: categoryInfo.color 
                        }}
                      >
                        <span className="mr-1">{categoryInfo.icon}</span>
                        {expense.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{apiUtils.formatCurrency(expense.amount)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{apiUtils.formatDate(expense.date)} • {apiUtils.formatTime(expense.time)}</div>
                    </div>
                  </div>
                  
                  {(expense.description || expense.payee) && (
                    <div className="space-y-1 mb-3">
                      {expense.description && (
                        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{expense.description}</p>
                      )}
                      {expense.payee && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Paid to: {expense.payee}</p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {onEditExpense && (
                      <button
                        onClick={() => onEditExpense(expense)}
                        className="flex items-center px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteExpense(expense.expenseId)}
                      className="flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Total: {apiUtils.formatCurrency(
              filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
