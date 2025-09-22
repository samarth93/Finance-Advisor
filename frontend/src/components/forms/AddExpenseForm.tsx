'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { Category } from '@/types';

interface AddExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  amount: string;
  categoryId: string;
  date: string;
  time: string;
  payee: string;
  description: string;
  paymentMethod: string;
  notes: string;
}

const PAYMENT_METHODS = [
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'CASH', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'NET_BANKING', label: 'Net Banking' },
  { value: 'WALLET', label: 'Digital Wallet' },
];

export default function AddExpenseForm({ isOpen, onClose, onSuccess }: AddExpenseFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      paymentMethod: 'UPI',
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const categoriesData = await api.categories.getAll();
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Find the selected category to get both categoryId and category name
      const selectedCategory = categories.find(cat => cat.categoryId === data.categoryId);
      
      if (!selectedCategory) {
        toast.error('Please select a valid category');
        setIsSubmitting(false);
        return;
      }

      const expenseData = {
        amount: parseFloat(data.amount),
        category: selectedCategory.name, // Add category name (required by backend)
        categoryId: data.categoryId,     // Keep categoryId for reference
        date: data.date,
        time: data.time,
        payee: data.payee || undefined,
        description: data.description || undefined,
        paymentMethod: data.paymentMethod,
        notes: data.notes || undefined,
      };

      await api.expenses.create(expenseData);
      toast.success('Expense added successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast.error(error.response?.data?.message || 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Expense</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Amount */}
          <div>
            <label className="label">Amount *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' },
                max: { value: 1000000, message: 'Amount cannot exceed 1,000,000' },
              })}
              className={`input ${errors.amount ? 'input-error' : ''}`}
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="label">Category *</label>
            <select
              {...register('categoryId', { required: 'Category is required' })}
              className={`input ${errors.categoryId ? 'input-error' : ''}`}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date *</label>
              <input
                type="date"
                {...register('date', { required: 'Date is required' })}
                className={`input ${errors.date ? 'input-error' : ''}`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>
            <div>
              <label className="label">Time *</label>
              <input
                type="time"
                {...register('time', { required: 'Time is required' })}
                className={`input ${errors.time ? 'input-error' : ''}`}
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Payee */}
          <div>
            <label className="label">Payee</label>
            <input
              type="text"
              {...register('payee', {
                maxLength: { value: 100, message: 'Payee name cannot exceed 100 characters' },
              })}
              className="input"
              placeholder="Enter payee name"
            />
            {errors.payee && (
              <p className="text-red-500 text-sm mt-1">{errors.payee.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              {...register('description', {
                maxLength: { value: 500, message: 'Description cannot exceed 500 characters' },
              })}
              className="input"
              rows={2}
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="label">Payment Method</label>
            <select {...register('paymentMethod')} className="input">
              {PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea
              {...register('notes', {
                maxLength: { value: 1000, message: 'Notes cannot exceed 1000 characters' },
              })}
              className="input"
              rows={2}
              placeholder="Additional notes"
            />
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

