'use client';

import { useState } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Alert {
  id: number;
  type: 'high' | 'medium';
  title: string;
  message: string;
  timestamp: Date;
}

export default function AlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([]); // Initialize with an empty array

  // Function to dismiss an alert
  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // Get alert background color based on severity
  const getAlertBgColor = (type: Alert['type']) => {
    switch (type) {
      case 'high':
        return 'bg-red-100 border-red-500';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  // Get alert icon color based on severity
  const getAlertIconColor = (type: Alert['type']) => {
    switch (type) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  // Format timestamp to relative time (e.g., "5 minutes ago")
  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm space-y-4 z-50">
      {/* Alert List */}
      {alerts.length > 0 ? (
        alerts.map((alert) => (
          <div
            key={alert.id}
            className={`${getAlertBgColor(alert.type)} border-l-4 rounded-md shadow-lg transition-all duration-500 ease-in-out transform hover:-translate-y-1`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon
                    className={`h-5 w-5 ${getAlertIconColor(alert.type)}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="mt-1 text-sm text-gray-700">{alert.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{formatRelativeTime(alert.timestamp)}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-transparent inline-flex text-gray-400 hover:text-gray-500"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 text-center">No alerts to display.</p>
      )}
    </div>
  );
}