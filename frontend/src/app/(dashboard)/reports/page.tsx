'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const handleGenerateReport = () => {
    toast('Report generation feature coming soon!', { icon: 'ℹ️' });
  };

  const handleScheduleReport = () => {
    toast('Scheduled reports feature coming soon!', { icon: 'ℹ️' });
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
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Generate detailed expense reports and summaries</p>
      </div>

      {/* Report Generation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Generate Report
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Period
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleGenerateReport}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Reports</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={handleGenerateReport}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-medium text-gray-900">This Month's Expenses</h3>
              <p className="text-sm text-gray-500 mt-1">Complete breakdown of current month</p>
            </button>
            <button
              onClick={handleGenerateReport}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-medium text-gray-900">Category Analysis</h3>
              <p className="text-sm text-gray-500 mt-1">Spending by category</p>
            </button>
            <button
              onClick={handleGenerateReport}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <h3 className="font-medium text-gray-900">Yearly Summary</h3>
              <p className="text-sm text-gray-500 mt-1">Complete year overview</p>
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Scheduled Reports
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Reports</h3>
            <p className="text-gray-500 mb-4">Set up automatic report generation for regular insights</p>
            <button
              onClick={handleScheduleReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Schedule Report
            </button>
          </div>
        </div>
      </div>

      {/* Report History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Report History</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Generated</h3>
            <p className="text-gray-500">Your generated reports will appear here</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}