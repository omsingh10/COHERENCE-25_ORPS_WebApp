'use client';

import { useState } from 'react';
import CitySearch from './CitySearch'; // Ensure CitySearch.tsx or CitySearch/index.tsx exists in the same directory

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>('Dashboard'); // State to track the active tab

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <p>Welcome to the Admin Dashboard. Here you can view overall statistics and system health.</p>;
      case 'User Management':
        return <p>Manage users here. Add, edit, or remove users from the system.</p>;
      case 'Alert Control':
        return <p>Configure alerts and notifications for the system here.</p>;
      case 'Report Management':
        return <p>View and manage reports submitted by users here.</p>;
      default:
        return <p>Select an option from the Admin Control Panel.</p>;
    }
  };

// Removed duplicate AdminPage function

  return (
    <div className="flex h-screen">
      {/* Admin Control Panel */}
      <div className="w-1/4 bg-gray-100 dark:bg-gray-800 p-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Admin Control Panel</h2>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab('Dashboard')}
              className={`w-full text-left p-2 rounded-md ${
                activeTab === 'Dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('User Management')}
              className={`w-full text-left p-2 rounded-md ${
                activeTab === 'User Management' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              User Management
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('Alert Control')}
              className={`w-full text-left p-2 rounded-md ${
                activeTab === 'Alert Control' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Alert Control
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('Report Management')}
              className={`w-full text-left p-2 rounded-md ${
                activeTab === 'Report Management' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Report Management
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white dark:bg-gray-900 p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{activeTab}</h1>
        <div className="text-gray-600 dark:text-gray-400">{renderContent()}</div>
      </div>
    </div>
  );
}