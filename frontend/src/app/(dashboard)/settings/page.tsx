'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  KeyIcon, 
  BellIcon, 
  PaintBrushIcon,
  TrashIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { User } from '@/types';
import ThemeToggle from '@/components/settings/ThemeToggle';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleExportData = () => {
    // TODO: Implement data export
    toast('Data export feature coming soon!', { icon: 'ℹ️' });
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    toast('Account deletion feature coming soon!', { icon: '⚠️' });
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account and application preferences</p>
      </div>

      {/* Theme Settings */}
      <ThemeToggle />

      {/* Profile Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <UserIcon className="w-5 h-5 mr-2" />
            Profile Settings
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
            </div>
            <div className="pt-4">
              <button
                onClick={() => toast('Profile editing coming soon!', { icon: 'ℹ️' })}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <KeyIcon className="w-5 h-5 mr-2" />
            Security Settings
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <button
              onClick={() => toast('Password change feature coming soon!', { icon: 'ℹ️' })}
              className="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Change Password</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
            </button>
            <button
              onClick={() => toast('Two-factor authentication coming soon!', { icon: 'ℹ️' })}
              className="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add extra security to your account</p>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <BellIcon className="w-5 h-5 mr-2" />
            Notification Settings
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive expense alerts via email</p>
              </div>
              <button
                onClick={() => toast('Notification settings coming soon!', { icon: 'ℹ️' })}
                className="bg-gray-200 dark:bg-gray-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Monthly Reports</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get monthly expense summaries</p>
              </div>
              <button
                onClick={() => toast('Notification settings coming soon!', { icon: 'ℹ️' })}
                className="bg-gray-200 dark:bg-gray-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            Data Management
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <button
              onClick={handleExportData}
              className="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Export Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Download your expense data as CSV</p>
            </button>
            <button
              onClick={() => toast('Data import feature coming soon!', { icon: 'ℹ️' })}
              className="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Import Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload expenses from CSV file</p>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-700 transition-colors duration-300">
        <div className="px-6 py-4 border-b border-red-200 dark:border-red-700">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-400 flex items-center">
            <TrashIcon className="w-5 h-5 mr-2" />
            Danger Zone
          </h2>
        </div>
        <div className="p-6">
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
        </div>
      </div>
    </motion.div>
  );
}