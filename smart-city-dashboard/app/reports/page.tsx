'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  MapPinIcon,
  ClockIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');
  const [reports, setReports] = useState<any[]>([]); // Reports fetched from local storage

  // Fetch reports from local storage on component mount
  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
    setReports(storedReports);
  }, []);

  // Filter reports based on search query and status
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      searchQuery === '' ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Status badge styles
  const statusStyles = {
    open: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onSearch={(city) => console.log(`Search query: ${city}`)} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-bg p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">Community Reports</h2>
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
                  View and track reports about city infrastructure and services.
                </p>
              </div>
            </div>

            {/* Search and filter */}
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-dark-text-muted" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports by keyword..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-dark-text-muted focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-700 dark:focus:border-primary-700 sm:text-sm bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text-primary"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-2 text-xs font-medium rounded-md ${
                    statusFilter === 'all'
                      ? 'bg-gray-200 text-gray-800 dark:bg-dark-border dark:text-dark-text-primary'
                      : 'bg-white text-gray-600 dark:bg-dark-card dark:text-dark-text-secondary'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('open')}
                  className={`px-3 py-2 text-xs font-medium rounded-md ${
                    statusFilter === 'open'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-white text-gray-600 dark:bg-dark-card dark:text-dark-text-secondary'
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setStatusFilter('in-progress')}
                  className={`px-3 py-2 text-xs font-medium rounded-md ${
                    statusFilter === 'in-progress'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-white text-gray-600 dark:bg-dark-card dark:text-dark-text-secondary'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setStatusFilter('resolved')}
                  className={`px-3 py-2 text-xs font-medium rounded-md ${
                    statusFilter === 'resolved'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-white text-gray-600 dark:bg-dark-card dark:text-dark-text-secondary'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* Reports list */}
            {filteredReports.length > 0 ? (
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm overflow-hidden divide-y divide-gray-200 dark:divide-dark-border mt-6">
                {filteredReports.map((report) => (
                  <div key={report.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <DocumentTextIcon className="h-6 w-6 text-gray-400 dark:text-dark-text-muted" />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">
                              {report.category}
                            </h3>
                            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-dark-text-secondary">
                                <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-dark-text-muted" />
                                {report.location}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-dark-text-secondary">
                                <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-dark-text-muted" />
                                {formatDate(report.reportedAt)}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-dark-text-secondary">
                                <UserCircleIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-dark-text-muted" />
                                Reported by: {report.name}
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-dark-text-secondary">
                              {report.description}
                            </p>
                            <div className="mt-2 flex items-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  statusStyles[report.status as keyof typeof statusStyles]
                                }`}
                              >
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </span>
                              <span className="ml-2 text-xs text-gray-500 dark:text-dark-text-muted">
                                Priority: {report.priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-8 text-center mt-6">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-dark-text-muted" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-dark-text-primary">
                  No reports found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">
                  No reports matching your search criteria.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}