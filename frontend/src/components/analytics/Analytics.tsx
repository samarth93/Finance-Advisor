'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'react-hot-toast';
import { 
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { api, apiUtils } from '@/lib/api';
import { ExpenseSummary } from '@/types';

interface AnalyticsProps {
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
  '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B',
  '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'
];

export default function Analytics() {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const summaryData = await api.expenses.getSummary(period);
      setSummary(summaryData);
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!summary || summary.totalExpenses === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <ChartBarIcon className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-lg font-medium">No expense data available</p>
        <p className="text-sm">Start adding expenses to see analytics</p>
      </div>
    );
  }

  const pieData = summary.categoryBreakdown.map((category, index) => ({
    name: category.categoryName,
    value: category.amount,
    color: category.color || COLORS[index % COLORS.length],
    icon: category.icon,
    count: category.count,
    percentage: category.percentage,
  }));

  const monthlyData = summary.monthlyTrends.filter(trend => trend.amount > 0 || trend.count > 0).map(trend => ({
    month: new Date(trend.monthYear + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    amount: trend.amount,
    count: trend.count,
  }));

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Expense Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod('MONTHLY')}
            className={`btn ${period === 'MONTHLY' ? 'btn-primary' : 'btn-outline'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPeriod('YEARLY')}
            className={`btn ${period === 'YEARLY' ? 'btn-primary' : 'btn-outline'}`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {apiUtils.formatCurrency(summary.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{summary.totalExpenses}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Expense</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {apiUtils.formatCurrency(summary.averageExpense)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Category</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{summary.topCategory || 'N/A'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {summary.topCategoryAmount ? apiUtils.formatCurrency(summary.topCategoryAmount) : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Category Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Spending by Category</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage?.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ color: 'currentColor' }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [apiUtils.formatCurrency(value), 'Amount']}
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg)',
                    color: 'var(--tooltip-color)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Category List */}
            <div className="mt-4 space-y-2">
              {summary.categoryBreakdown.slice(0, 5).map((category, index) => (
                <div key={category.categoryId} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color || COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {category.icon} {category.categoryName}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {apiUtils.formatCurrency(category.amount)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {category.count} expenses
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart - Category Amounts */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Category Comparison</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary.categoryBreakdown.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis 
                  dataKey="categoryName" 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'currentColor' }} 
                  axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
                />
                <Tooltip 
                  formatter={(value: number) => [apiUtils.formatCurrency(value), 'Amount']}
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg)',
                    color: 'var(--tooltip-color)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      {monthlyData.length > 1 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Spending Trends</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
                />
                <YAxis 
                  yAxisId="left" 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tick={{ fontSize: 12, fill: 'currentColor' }}
                  axisLine={{ stroke: 'currentColor', opacity: 0.2 }}
                  tickLine={{ stroke: 'currentColor', opacity: 0.2 }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'Amount Spent' ? apiUtils.formatCurrency(value) : value,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--tooltip-bg)',
                    color: 'var(--tooltip-color)',
                    border: '1px solid var(--tooltip-border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: 'currentColor' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  name="Amount Spent"
                  yAxisId="left"
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  name="Number of Expenses"
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Payees */}
      {summary.topPayees && summary.topPayees.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Top Payees</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summary.topPayees.slice(0, 6).map((payee, index) => (
                <div key={payee} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{payee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

