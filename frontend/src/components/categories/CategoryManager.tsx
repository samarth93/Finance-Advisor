'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import { Category, CategoryRequest } from '@/types';

interface CategoryManagerProps {
  onCategoryChange?: () => void;
}

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
}

const PREDEFINED_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
  '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6',
  '#F97316', '#84CC16', '#06B6D4', '#8B5A2B'
];

const PREDEFINED_ICONS = [
  '🍽️', '🛒', '✈️', '📄', '🎬', '🏥', 
  '🚗', '🏠', '👕', '📚', '💡', '🎯',
  '💰', '📦', '🎮', '☕', '🏃', '🎵'
];

export default function CategoryManager({ onCategoryChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      color: '#6366F1',
      icon: '💰',
    },
  });

  const watchedColor = watch('color');
  const watchedIcon = watch('icon');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const categoriesData = await api.categories.getAll();
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const categoryData: CategoryRequest = {
        name: data.name,
        description: data.description,
        color: data.color,
        icon: data.icon,
      };

      if (editingCategory) {
        await api.categories.update(editingCategory.categoryId, categoryData);
        toast.success('Category updated successfully!');
      } else {
        await api.categories.create(categoryData);
        toast.success('Category created successfully!');
      }

      reset();
      setShowForm(false);
      setEditingCategory(null);
      fetchCategories();
      onCategoryChange?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('description', category.description || '');
    setValue('color', category.color);
    setValue('icon', category.icon);
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the "${categoryName}" category?`)) return;

    try {
      await api.categories.delete(categoryId);
      toast.success('Category deleted successfully');
      fetchCategories();
      onCategoryChange?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    reset();
  };

  const initializeDefaultCategories = async () => {
    try {
      // Create some default categories manually
      const defaultCategories = [
        { name: 'Food & Dining', description: 'Restaurants, groceries, and food delivery', icon: '🍽️' },
        { name: 'Transportation', description: 'Gas, public transport, ride-sharing', icon: '🚗' },
        { name: 'Entertainment', description: 'Movies, games, subscriptions', icon: '🎬' },
        { name: 'Utilities', description: 'Electricity, water, internet, phone', icon: '💡' },
        { name: 'Healthcare', description: 'Medical expenses, pharmacy, insurance', icon: '🏥' },
        { name: 'Shopping', description: 'Clothing, electronics, household items', icon: '🛍️' }
      ];
      
      for (const category of defaultCategories) {
        await api.categories.create(category);
      }
      
      toast.success('Default categories initialized!');
      fetchCategories();
      onCategoryChange?.();
    } catch (error) {
      toast.error('Failed to initialize default categories');
    }
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Manage Categories</h2>
        <div className="space-x-2">
          {categories.length === 0 && (
            <button
              onClick={initializeDefaultCategories}
              className="btn btn-outline"
            >
              Initialize Defaults
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="label">Category Name *</label>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Category name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
                  })}
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter category name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="label">Description</label>
                <input
                  type="text"
                  {...register('description', {
                    maxLength: { value: 200, message: 'Description cannot exceed 200 characters' },
                  })}
                  className="input"
                  placeholder="Enter description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="label">Icon</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {PREDEFINED_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setValue('icon', icon)}
                    className={`p-2 text-xl border rounded-md hover:border-primary-500 transition-colors ${
                      watchedIcon === icon ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <input
                type="text"
                {...register('icon')}
                className="input"
                placeholder="Or enter custom emoji"
              />
            </div>

            {/* Color Selection */}
            <div>
              <label className="label">Color</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue('color', color)}
                    className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                      watchedColor === color ? 'border-gray-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <input
                type="color"
                {...register('color')}
                className="w-full h-10 rounded border border-gray-300"
              />
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: watchedColor + '20', 
                  color: watchedColor 
                }}
              >
                <span className="mr-1">{watchedIcon}</span>
                {watch('name') || 'Category Name'}
              </span>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={handleCancel} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No categories found</p>
          <p className="text-sm">Create your first category to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.categoryId}
              className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mr-2"
                      style={{ 
                        backgroundColor: category.color + '20', 
                        color: category.color 
                      }}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.name}
                    </span>
                    {category.isDefault && (
                      <span className="badge badge-gray text-xs">Default</span>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{category.description}</p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  {!category.isDefault && (
                    <button
                      onClick={() => handleDelete(category.categoryId, category.name)}
                      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

