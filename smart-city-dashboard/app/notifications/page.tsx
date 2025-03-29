'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the Notification interface
interface Notification {
  id: number;
  title: string;
  message: string;
  category: 'alerts' | 'reports' | 'system';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  isRead: boolean;
}

// Define the NotificationsContextType interface
interface NotificationsContextType {
  notifications: Notification[];
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
}

// Create the NotificationsContext
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// NotificationsProvider component to manage notifications state
export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Traffic Alert',
      message: 'Heavy congestion reported on Main Highway due to accident.',
      category: 'alerts',
      priority: 'high',
      timestamp: '10 minutes ago',
      isRead: false,
    },
    {
      id: 2,
      title: 'Report Update',
      message: 'Your report about the street light on Park Avenue has been updated. Current status: In Progress.',
      category: 'reports',
      priority: 'medium',
      timestamp: '25 minutes ago',
      isRead: true,
    },
    // Add more sample notifications here...
  ]);

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  // Function to add a new notification
  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, markAllAsRead, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use the NotificationsContext
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

// NotificationsPage component to display the notifications list
export default function NotificationsPage() {
  const { notifications, markAllAsRead } = useNotifications();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {/* Mark All as Read Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={markAllAsRead}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-md ${
                notification.isRead ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <h2 className="font-semibold">{notification.title}</h2>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <div className="text-xs text-gray-500 mt-2">
                <span className="capitalize">{notification.priority} Priority</span> •{' '}
                <span>{notification.timestamp}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            <p>No notifications available.</p>
          </div>
        )}
      </div>
    </div>
  );
}