'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { BellIcon, CheckIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<{ id: number; title: string; description: string; severity: string; time: string; location: string; status: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    severity: 'medium',
  });

  const severityStyles = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  };

  // Function to handle creating a new alert
  const handleCreateAlert = () => {
    const alert = {
      id: alerts.length + 1,
      title: newAlert.title,
      description: newAlert.description,
      severity: newAlert.severity,
      time: 'Just now',
      location: 'Unknown',
      status: 'active',
    };
    setAlerts([alert, ...alerts]);
    setIsModalOpen(false);
    setNewAlert({ title: '', description: '', severity: 'medium' });
  };

  // Function to acknowledge an alert
  const handleAcknowledge = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onSearch={(city) => console.log(`Searching for city: ${city}`)} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-bg p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">City Alerts</h2>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                  Monitoring and managing critical situations
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md shadow-sm text-sm"
              >
                Create New Alert
              </button>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className="bg-white dark:bg-dark-card rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-gray-900 dark:text-dark-text-primary">
                            {alert.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">
                            {alert.description}
                          </p>
                          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-dark-text-muted">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                severityStyles[alert.severity as keyof typeof severityStyles]
                              }`}
                            >
                              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Severity
                            </span>
                            <span className="mx-2">•</span>
                            <span>{alert.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Acknowledge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {alerts.length === 0 && (
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-8 text-center">
                  <BellIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-dark-text-muted" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-dark-text-primary">No active alerts</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">
                    All clear! There are no active alerts in the system.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal for Creating Alerts */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Create New Alert</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={newAlert.title}
                onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newAlert.description}
                onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Severity</label>
              <select
                value={newAlert.severity}
                onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                className="w-full p-2 border rounded-md"
              >
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAlert}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}