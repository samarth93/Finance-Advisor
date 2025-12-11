'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();

  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: SunIcon,
      description: 'Light theme for bright environments',
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: MoonIcon,
      description: 'Dark theme for low-light environments',
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: ComputerDesktopIcon,
      description: 'Follow your system preference',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Theme Preference
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose your preferred theme or let the system decide
        </p>
      </div>

      <div className="space-y-3">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isSelected = theme === themeOption.value;

          return (
            <motion.button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-medium ${
                        isSelected
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {themeOption.label}
                    </h4>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      isSelected
                        ? 'text-blue-700 dark:text-blue-200'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {themeOption.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Current theme indicator */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Current theme:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
            {isDark ? 'Dark' : 'Light'}
            {theme === 'system' && ' (System)'}
          </span>
        </div>
      </div>
    </div>
  );
}