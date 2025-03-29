'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import {
  UserGroupIcon,
  ServerIcon,
  Cog6ToothIcon,
  BellIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Sample system stats
  const systemStats = {
    uptime: '99.98%',
    responseTime: '120ms',
    activeSensors: 1245,
    activeUsers: 532,
    alertsToday: 18,
    pendingReports: 24
  };
  
  // Sample users
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      role: 'Administrator',
      department: 'IT Department',
      status: 'Active',
      lastLogin: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      role: 'Manager',
      department: 'Transportation',
      status: 'Active',
      lastLogin: '1 day ago'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      role: 'Analyst',
      department: 'Environmental Services',
      status: 'Active',
      lastLogin: '3 hours ago'
    },
    {
      id: 4,
      name: 'Jessica Miller',
      email: 'jessica.miller@example.com',
      role: 'Manager',
      department: 'Public Safety',
      status: 'Inactive',
      lastLogin: '2 weeks ago'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      role: 'Operator',
      department: 'Utilities',
      status: 'Active',
      lastLogin: '5 hours ago'
    }
  ]);
  
  // Sample recent activities
  const recentActivities = [
    { id: 1, user: 'System', action: 'Alert triggered', details: 'High traffic congestion on Main Highway', time: '10 minutes ago' },
    { id: 2, user: 'Jane Cooper', action: 'Updated report', details: 'Street light repair on Oak Avenue', time: '25 minutes ago' },
    { id: 3, user: 'System', action: 'Service status changed', details: 'Water pressure normalized in North District', time: '1 hour ago' },
    { id: 4, user: 'Cody Fisher', action: 'User report approved', details: 'Pothole report on 5th Street', time: '2 hours ago' },
    { id: 5, user: 'System', action: 'Backup completed', details: 'Database backup successfully completed', time: '4 hours ago' }
  ];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Analyst',
    department: 'IT Department',
    status: 'Active'
  });

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort users
  const sortedUsers = [...users].sort((a: any, b: any) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter users based on search query
  const filteredUsers = sortedUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle adding a new user
  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      setUsers([...users, { ...newUser, id: users.length + 1, lastLogin: 'Never' }]);
      setNewUser({
        name: '',
        email: '',
        role: 'Analyst',
        department: 'IT Department',
        status: 'Active'
      });
      setShowAddUserModal(false);
    }
  };

  // Handle editing a user
  const handleEditUser = (user: any) => {
    setEditingUser({ ...user });
  };

  // Save edited user
  const handleSaveEditedUser = () => {
    if (editingUser) {
      setUsers(users.map(user => user.id === editingUser.id ? editingUser : user));
      setEditingUser(null);
    }
  };

  // Delete user
  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Toggle user status
  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } 
        : user
    ));
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'users', name: 'User Management', icon: UserGroupIcon },
    { id: 'system', name: 'System Settings', icon: ServerIcon },
    { id: 'alerts', name: 'Alert Configuration', icon: BellIcon },
    { id: 'reports', name: 'Report Management', icon: DocumentTextIcon },
  ];
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-bg p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Tabs */}
              <div className="w-full xl:w-64 bg-white dark:bg-dark-card rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-dark-border">
                  <h2 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary flex items-center">
                    <Cog6ToothIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-dark-text-muted" />
                    Admin Control
                  </h2>
                </div>
                <nav className="p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 dark:bg-dark-border/50 dark:text-primary-400'
                          : 'text-gray-700 hover:bg-gray-50 dark:text-dark-text-secondary dark:hover:bg-dark-border/30'
                      }`}
                    >
                      <tab.icon className="w-5 h-5 mr-3 text-gray-500 dark:text-dark-text-muted" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Content */}
              <div className="flex-1">
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">System Overview</h3>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="bg-white dark:bg-dark-card overflow-hidden rounded-lg shadow-sm">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <ServerIcon className="h-6 w-6 text-gray-400 dark:text-dark-text-muted" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary truncate">System Uptime</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">{systemStats.uptime}</div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-border px-5 py-3">
                          <div className="text-sm">
                            <a href="#" className="font-medium text-primary-700 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                              View details
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-dark-card overflow-hidden rounded-lg shadow-sm">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <UserGroupIcon className="h-6 w-6 text-gray-400 dark:text-dark-text-muted" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary truncate">Active Users</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">{systemStats.activeUsers}</div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-border px-5 py-3">
                          <div className="text-sm">
                            <a href="#" className="font-medium text-primary-700 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                              View details
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-dark-card overflow-hidden rounded-lg shadow-sm">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <BellIcon className="h-6 w-6 text-gray-400 dark:text-dark-text-muted" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary truncate">Alerts Today</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">{systemStats.alertsToday}</div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-border px-5 py-3">
                          <div className="text-sm">
                            <a href="#" className="font-medium text-primary-700 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                              View details
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-dark-card overflow-hidden rounded-lg shadow-sm">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <DocumentTextIcon className="h-6 w-6 text-gray-400 dark:text-dark-text-muted" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary truncate">Pending Reports</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">{systemStats.pendingReports}</div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-border px-5 py-3">
                          <div className="text-sm">
                            <a href="#" className="font-medium text-primary-700 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                              View details
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-dark-card overflow-hidden rounded-lg shadow-sm">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <ServerIcon className="h-6 w-6 text-gray-400 dark:text-dark-text-muted" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary truncate">Active Sensors</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">{systemStats.activeSensors}</div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-border px-5 py-3">
                          <div className="text-sm">
                            <a href="#" className="font-medium text-primary-700 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                              View details
                            </a>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-dark-card overflow-hidden rounded-lg shadow-sm">
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <ServerIcon className="h-6 w-6 text-gray-400 dark:text-dark-text-muted" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary truncate">Response Time</dt>
                                <dd>
                                  <div className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">{systemStats.responseTime}</div>
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-dark-border px-5 py-3">
                          <div className="text-sm">
                            <a href="#" className="font-medium text-primary-700 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                              View details
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-dark-card overflow-hidden rounded-lg shadow-sm">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">Quick Actions</h3>
                      </div>
                      <div className="border-t border-gray-200 dark:border-dark-border">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 p-6">
                          <button 
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <BellIcon className="h-5 w-5 mr-2" />
                            Send Alert
                          </button>
                          <button 
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                            Export Data
                          </button>
                          <button 
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                            Import Data
                          </button>
                          <button 
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            <Cog6ToothIcon className="h-5 w-5 mr-2" />
                            System Status
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-dark-card overflow-hidden shadow-sm rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">Recent Activity</h3>
                      </div>
                      <div className="border-t border-gray-200 dark:border-dark-border">
                        <ul role="list" className="divide-y divide-gray-200 dark:divide-dark-border">
                          {recentActivities.map((activity) => (
                            <li key={activity.id} className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <p className="font-medium text-primary-600 dark:text-primary-400 truncate">{activity.user}</p>
                                  <p className="ml-2 truncate text-sm text-gray-500 dark:text-dark-text-muted">{activity.action}</p>
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-dark-border dark:text-dark-text-secondary">
                                    {activity.time}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{activity.details}</p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'users' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">User Management</h3>
                      <button 
                        onClick={() => setShowAddUserModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Add User
                      </button>
                    </div>
                    
                    <div className="bg-white dark:bg-dark-card shadow-sm rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                          <thead className="bg-gray-50 dark:bg-dark-border">
                            <tr>
                              <th 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('name')}
                              >
                                <div className="flex items-center">
                                  <span>Name</span>
                                  {sortField === 'name' && (
                                    <span className="ml-2">
                                      {sortDirection === 'asc' ? 
                                        <ArrowUpIcon className="h-4 w-4" /> : 
                                        <ArrowDownIcon className="h-4 w-4" />
                                      }
                                    </span>
                                  )}
                                </div>
                              </th>
                              <th 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('role')}
                              >
                                <div className="flex items-center">
                                  <span>Role</span>
                                  {sortField === 'role' && (
                                    <span className="ml-2">
                                      {sortDirection === 'asc' ? 
                                        <ArrowUpIcon className="h-4 w-4" /> : 
                                        <ArrowDownIcon className="h-4 w-4" />
                                      }
                                    </span>
                                  )}
                                </div>
                              </th>
                              <th 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('department')}
                              >
                                <div className="flex items-center">
                                  <span>Department</span>
                                  {sortField === 'department' && (
                                    <span className="ml-2">
                                      {sortDirection === 'asc' ? 
                                        <ArrowUpIcon className="h-4 w-4" /> : 
                                        <ArrowDownIcon className="h-4 w-4" />
                                      }
                                    </span>
                                  )}
                                </div>
                              </th>
                              <th 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('status')}
                              >
                                <div className="flex items-center">
                                  <span>Status</span>
                                  {sortField === 'status' && (
                                    <span className="ml-2">
                                      {sortDirection === 'asc' ? 
                                        <ArrowUpIcon className="h-4 w-4" /> : 
                                        <ArrowDownIcon className="h-4 w-4" />
                                      }
                                    </span>
                                  )}
                                </div>
                              </th>
                              <th 
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider cursor-pointer"
                                onClick={() => handleSort('lastLogin')}
                              >
                                <div className="flex items-center">
                                  <span>Last Login</span>
                                  {sortField === 'lastLogin' && (
                                    <span className="ml-2">
                                      {sortDirection === 'asc' ? 
                                        <ArrowUpIcon className="h-4 w-4" /> : 
                                        <ArrowDownIcon className="h-4 w-4" />
                                      }
                                    </span>
                                  )}
                                </div>
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
                            {filteredUsers.length > 0 ? (
                              filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-dark-border">
                                  {editingUser && editingUser.id === user.id ? (
                                    // Editing mode
                                    <>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                          type="text"
                                          className="w-full px-2 py-1 border border-gray-300 dark:border-dark-border rounded-md bg-white dark:bg-dark-card text-sm"
                                          value={editingUser.name}
                                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                        />
                                        <input
                                          type="email"
                                          className="w-full mt-1 px-2 py-1 border border-gray-300 dark:border-dark-border rounded-md bg-white dark:bg-dark-card text-xs text-gray-500"
                                          value={editingUser.email}
                                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                        />
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                          className="w-full px-2 py-1 border border-gray-300 dark:border-dark-border rounded-md bg-white dark:bg-dark-card text-sm"
                                          value={editingUser.role}
                                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                        >
                                          <option value="Administrator">Administrator</option>
                                          <option value="Manager">Manager</option>
                                          <option value="Analyst">Analyst</option>
                                          <option value="Operator">Operator</option>
                                        </select>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                          className="w-full px-2 py-1 border border-gray-300 dark:border-dark-border rounded-md bg-white dark:bg-dark-card text-sm"
                                          value={editingUser.department}
                                          onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                                        >
                                          <option value="IT Department">IT Department</option>
                                          <option value="Transportation">Transportation</option>
                                          <option value="Environmental Services">Environmental Services</option>
                                          <option value="Public Safety">Public Safety</option>
                                          <option value="Utilities">Utilities</option>
                                        </select>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                          className="w-full px-2 py-1 border border-gray-300 dark:border-dark-border rounded-md bg-white dark:bg-dark-card text-sm"
                                          value={editingUser.status}
                                          onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                                        >
                                          <option value="Active">Active</option>
                                          <option value="Inactive">Inactive</option>
                                        </select>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                                        {editingUser.lastLogin}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                          onClick={handleSaveEditedUser}
                                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                                        >
                                          <CheckIcon className="h-5 w-5" />
                                          <span className="sr-only">Save</span>
                                        </button>
                                        <button
                                          onClick={() => setEditingUser(null)}
                                          className="text-gray-600 hover:text-gray-900 dark:text-dark-text-secondary dark:hover:text-dark-text-primary"
                                        >
                                          <XMarkIcon className="h-5 w-5" />
                                          <span className="sr-only">Cancel</span>
                                        </button>
                                      </td>
                                    </>
                                  ) : (
                                    // View mode
                                    <>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                                              <UserIcon className="h-5 w-5" />
                                            </div>
                                          </div>
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">{user.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-dark-text-secondary">{user.email}</div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                                        {user.role}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                                        {user.department}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          user.status === 'Active' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                          {user.status}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">
                                        {user.lastLogin}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                          onClick={() => handleEditUser(user)}
                                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                                        >
                                          <PencilIcon className="h-5 w-5" />
                                          <span className="sr-only">Edit</span>
                                        </button>
                                        <button
                                          onClick={() => toggleUserStatus(user.id)}
                                          className={`${
                                            user.status === 'Active' 
                                              ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' 
                                              : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                                          } mr-3`}
                                        >
                                          {user.status === 'Active' ? 
                                            <XMarkIcon className="h-5 w-5" /> : 
                                            <CheckIcon className="h-5 w-5" />
                                          }
                                          <span className="sr-only">
                                            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                                          </span>
                                        </button>
                                        <button
                                          onClick={() => handleDeleteUser(user.id)}
                                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                          <TrashIcon className="h-5 w-5" />
                                          <span className="sr-only">Delete</span>
                                        </button>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-dark-text-secondary">
                                  No users found matching your search criteria.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Placeholders for other tabs */}
                {(activeTab === 'system' || activeTab === 'alerts' || activeTab === 'reports') && (
                  <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-2">
                      {activeTab === 'system' && 'System Settings'}
                      {activeTab === 'alerts' && 'Alert Configuration'}
                      {activeTab === 'reports' && 'Report Management'}
                    </h3>
                    <p className="text-gray-500 dark:text-dark-text-secondary">
                      This section is currently under development. Please check back later.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Add User Modal */}
            {showAddUserModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl max-w-md w-full mx-4">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary">Add New User</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-dark-text-muted focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-dark-text-primary"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-dark-text-muted focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-dark-text-primary"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                          Role
                        </label>
                        <select
                          id="role"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-dark-text-primary"
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Manager">Manager</option>
                          <option value="Analyst">Analyst</option>
                          <option value="Operator">Operator</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                          Department
                        </label>
                        <select
                          id="department"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-dark-text-primary"
                          value={newUser.department}
                          onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                        >
                          <option value="IT Department">IT Department</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Environmental Services">Environmental Services</option>
                          <option value="Public Safety">Public Safety</option>
                          <option value="Utilities">Utilities</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                          Status
                        </label>
                        <select
                          id="status"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-card dark:text-dark-text-primary"
                          value={newUser.status}
                          onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-border flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-dark-text-secondary bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-border focus:outline-none"
                      onClick={() => setShowAddUserModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none"
                      onClick={handleAddUser}
                    >
                      Add User
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 