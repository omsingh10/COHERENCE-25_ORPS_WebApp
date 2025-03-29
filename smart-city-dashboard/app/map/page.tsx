'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ClipboardDocumentCheckIcon, BellIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Dynamically import the Map component with SSR disabled
const DynamicMap = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-gray-100 dark:bg-dark-card flex items-center justify-center">Loading map...</div>
});

export default function MapPage() {
  const [activeView, setActiveView] = useState<'traffic' | 'environment' | 'infrastructure'>('traffic');
  const [showLegend, setShowLegend] = useState(true);
  
  // Mock data for incidents
  const incidents = [
    { id: 1, type: 'Traffic', location: 'Main St & 5th Ave', status: 'Active', time: '10 min ago', severity: 'High' },
    { id: 2, type: 'Infrastructure', location: 'West Bridge', status: 'In Progress', time: '25 min ago', severity: 'Medium' },
    { id: 3, type: 'Environment', location: 'City Park', status: 'Resolved', time: '2 hours ago', severity: 'Low' },
    { id: 4, type: 'Traffic', location: 'Highway 101 Exit', status: 'Active', time: '42 min ago', severity: 'Medium' },
  ];
  
  // Severity to color class mapping
  const severityColors = {
    High: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    Medium: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30',
    Low: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-bg p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">City Map</h2>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                  Interactive map of city infrastructure and monitoring
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button 
                  onClick={() => setActiveView('traffic')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeView === 'traffic' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border'
                  }`}
                >
                  Traffic
                </button>
                <button 
                  onClick={() => setActiveView('environment')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeView === 'environment' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border'
                  }`}
                >
                  Environment
                </button>
                <button 
                  onClick={() => setActiveView('infrastructure')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeView === 'infrastructure' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-border'
                  }`}
                >
                  Infrastructure
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm overflow-hidden h-[600px] w-full">
              <DynamicMap view={activeView} />
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-2">Traffic Status</h3>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                  Current traffic conditions across the city, updated in real-time.
                </p>
              </div>
              
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-2">Environmental Monitoring</h3>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                  Air quality, water levels, and other environmental indicators.
                </p>
              </div>
              
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-2">Infrastructure Overview</h3>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                  Status of power grid, water systems, and public transport.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 