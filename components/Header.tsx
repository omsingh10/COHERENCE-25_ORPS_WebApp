'use client';

import { BellIcon, UserCircleIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-dark-card shadow dark:shadow-dark-card theme-transition">
      <div className="flex flex-1 justify-between px-4 sm:px-6">
        <div className="flex flex-1">
          <h1 className="flex items-center text-2xl font-bold text-gray-800 dark:text-dark-text-primary theme-transition">
            CitySync 
          </h1>
        </div>
        <div className="ml-4 flex items-center space-x-4 md:ml-6">
          {/* Theme toggle button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative rounded-full bg-white dark:bg-dark-card p-1 text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary theme-transition"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <SunIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <MoonIcon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
          
          {/* Notification button */}
          <button
            type="button"
            className="relative rounded-full bg-white dark:bg-dark-card p-1 text-gray-500 dark:text-dark-text-secondary hover:text-gray-700 dark:hover:text-dark-text-primary theme-transition"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-3 rounded-full bg-white dark:bg-dark-card text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-700 focus:ring-offset-2 theme-transition"
            >
              <span className="sr-only">Open user menu</span>
              <UserCircleIcon className="h-8 w-8 text-gray-500 dark:text-dark-text-secondary" aria-hidden="true" />
              <span className="hidden md:inline-block font-medium text-gray-700 dark:text-dark-text-primary theme-transition">Admin User</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 