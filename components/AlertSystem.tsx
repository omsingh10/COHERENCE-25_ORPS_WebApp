'use client';

import { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Alert {
  id: number;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

const mockAlerts: Alert[] = [
  {
    id: 1,
    type: 'danger',
    title: 'High Air Pollution Detected',
    message: 'Air quality index exceeds safety threshold in Downtown area. Citizens advised to reduce outdoor activities.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: 2,
    type: 'warning',
    title: 'Traffic Congestion Alert',
    message: 'Heavy traffic reported on Main Street due to construction work. Expect delays of 15-20 minutes.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
  {
    id: 3,
    type: 'info',
    title: 'Water Conservation Notice',
    message: 'Reservoir levels below normal. Residents are encouraged to conserve water until further notice.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
  },
];

export default function AlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [showAll, setShowAll] = useState(false);

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance of new alert every 30 seconds
      if (Math.random() < 0.1) {
        const alertTypes = ['warning', 'danger', 'info'] as const;
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        const newAlertTemplates = {
          danger: {
            titles: [
              'Critical Power Outage',
              'Severe Flooding Risk',
              'Extreme Air Pollution',
              'Traffic Accident Reported'
            ],
            messages: [
              'Power outage affecting northern district. Emergency services deployed.',
              'Flood warning issued for riverside areas. Prepare for evacuation.',
              'Hazardous air quality detected. Stay indoors and use air purifiers.',
              'Major accident on Highway 101. Emergency response in progress.'
            ]
          },
          warning: {
            titles: [
              'Weather Advisory',
              'Moderate Traffic Congestion',
              'Elevated Water Usage',
              'Public Transport Delays'
            ],
            messages: [
              'Strong winds expected this evening. Secure loose items outdoors.',
              'Increased traffic in city center. Consider alternative routes.',
              'Water usage approaching critical levels. Please conserve water.',
              'Bus and train services experiencing 15-minute delays due to maintenance.'
            ]
          },
          info: {
            titles: [
              'Community Event Notice',
              'System Maintenance',
              'Public Service Announcement',
              'City Council Update'
            ],
            messages: [
              'Downtown festival this weekend. Some streets will be closed.',
              'Scheduled maintenance for smart traffic systems from 2-4 AM tomorrow.',
              'New recycling program launching next week. Check city website for details.',
              'City council approved new green energy initiative. Implementation starts next month.'
            ]
          }
        };
        
        const titleIndex = Math.floor(Math.random() * newAlertTemplates[alertType].titles.length);
        
        const newAlert: Alert = {
          id: Date.now(),
          type: alertType,
          title: newAlertTemplates[alertType].titles[titleIndex],
          message: newAlertTemplates[alertType].messages[titleIndex],
          timestamp: new Date(),
        };
        
        setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep only the 10 most recent alerts
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to dismiss an alert
  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  // Get alert background color based on type
  const getAlertBgColor = (type: Alert['type']) => {
    switch (type) {
      case 'danger':
        return 'bg-danger-100 border-danger-500';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500';
      case 'info':
        return 'bg-blue-100 border-blue-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  // Get alert icon color based on type
  const getAlertIconColor = (type: Alert['type']) => {
    switch (type) {
      case 'danger':
        return 'text-danger-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
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

  // Determine visible alerts
  const visibleAlerts = showAll ? alerts : alerts.slice(0, 3);

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-sm space-y-4 z-50">
      {visibleAlerts.map((alert) => (
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
      ))}
      
      {alerts.length > 3 && (
        <button
          className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200 ease-in-out"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show fewer alerts' : `Show all alerts (${alerts.length})`}
        </button>
      )}
    </div>
  );
} 