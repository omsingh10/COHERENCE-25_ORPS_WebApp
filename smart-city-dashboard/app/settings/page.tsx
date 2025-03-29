'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Cog6ToothIcon, 
  BellIcon, 
  UserIcon, 
  ShieldCheckIcon, 
  EyeIcon, 
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    alertTypes: {
      traffic: true,
      environment: true,
      infrastructure: false,
      safety: true
    }
  });
  
  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    shareLocation: true,
    anonymousReporting: false,
    dataRetention: '1-year'
  });
  
  // User profile state
  const [profile, setProfile] = useState({
    displayName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, USA',
    notifications: 'email'
  });
  
  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAlertTypeChange = (type: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      alertTypes: {
        ...prev.alertTypes,
        [type]: value
      }
    }));
  };
  
  const handlePrivacyChange = (field: string, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: EyeIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'about', name: 'About', icon: InformationCircleIcon },
  ];
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-bg p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Tabs */}
              <div className="w-full lg:w-64 bg-white dark:bg-dark-card rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-dark-border">
                  <h2 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary flex items-center">
                    <Cog6ToothIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-dark-text-muted" />
                    Settings
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
              <div className="flex-1 bg-white dark:bg-dark-card rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">
                    {tabs.find(tab => tab.id === activeTab)?.name || 'Settings'}
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* Appearance Tab */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-3">Theme</h4>
                        <div className="flex items-center">
                          <button
                            onClick={toggleTheme}
                            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-700 dark:focus:ring-offset-dark-card"
                            role="switch"
                            aria-checked={theme === 'dark'}
                          >
                            <span className="sr-only">Toggle dark mode</span>
                            <span
                              className={`${
                                theme === 'dark' ? 'translate-x-5 bg-white' : 'translate-x-0 bg-primary-600'
                              } pointer-events-none relative inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out`}
                            >
                              <span
                                className={`${
                                  theme === 'dark' ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
                                } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                                aria-hidden="true"
                              >
                                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" />
                                </svg>
                              </span>
                              <span
                                className={`${
                                  theme === 'dark' ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
                                } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                                aria-hidden="true"
                              >
                                <svg className="h-3 w-3 text-primary-600" fill="currentColor" viewBox="0 0 12 12">
                                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                </svg>
                              </span>
                            </span>
                          </button>
                          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-3">Accessibility</h4>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="highContrast"
                                name="highContrast"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="highContrast" className="font-medium text-gray-700 dark:text-dark-text-secondary">
                                High contrast mode
                              </label>
                              <p className="text-gray-500 dark:text-dark-text-muted">
                                Increase contrast for better readability
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="reducedMotion"
                                name="reducedMotion"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="reducedMotion" className="font-medium text-gray-700 dark:text-dark-text-secondary">
                                Reduced motion
                              </label>
                              <p className="text-gray-500 dark:text-dark-text-muted">
                                Minimize animations throughout the interface
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="largeText"
                                name="largeText"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="largeText" className="font-medium text-gray-700 dark:text-dark-text-secondary">
                                Larger text
                              </label>
                              <p className="text-gray-500 dark:text-dark-text-muted">
                                Increase font size throughout the application
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Notifications Tab */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-3">Notification Preferences</h4>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="emailAlerts"
                                name="emailAlerts"
                                type="checkbox"
                                checked={notificationSettings.emailAlerts}
                                onChange={(e) => handleNotificationChange('emailAlerts', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="emailAlerts" className="font-medium text-gray-700 dark:text-dark-text-secondary">
                                Email Alerts
                              </label>
                              <p className="text-gray-500 dark:text-dark-text-muted">
                                Receive notifications via email
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="pushNotifications"
                                name="pushNotifications"
                                type="checkbox"
                                checked={notificationSettings.pushNotifications}
                                onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="pushNotifications" className="font-medium text-gray-700 dark:text-dark-text-secondary">
                                Push Notifications
                              </label>
                              <p className="text-gray-500 dark:text-dark-text-muted">
                                Receive notifications on your device
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-3">Alert Types</h4>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="traffic"
                                name="traffic"
                                type="checkbox"
                                checked={notificationSettings.alertTypes.traffic}
                                onChange={(e) => handleAlertTypeChange('traffic', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="traffic" className="font-medium text-gray-700 dark:text-dark-text-secondary">
                                Traffic Alerts
                              </label>
                              <p className="text-gray-500 dark:text-dark-text-muted">
                                Congestion, accidents, road closures
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="environment"
                                name="environment"
                                type="checkbox"
                                checked={notificationSettings.alertTypes.environment}
                                onChange={(e) => handleAlertTypeChange('environment', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="environment" className="font-medium text-gray-700 dark:text-dark-text-secondary">
                                Environmental Alerts
                              </label>
                              <p className="text-gray-500 dark:text-dark-text-muted">
                                Air quality, flooding, severe weather
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="infrastructure"
                                name="infrastructure"
                                type="checkbox"
                                checked={notificationSettings.alertTypes.infrastructure}
                                onChange={(e) => handleAlertTypeChange('infrastructure', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="infrastructure" className="font-medium text-gray-700 dark:text-dark-text-secondary">
                                Infrastructure Alerts
                              </label>
                              <p className="text-gray-500 dark:text-dark-text-muted">
                                Maintenance, service disruptions, outages
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="safety"
                                name="safety"
                                type="checkbox"
                                checked={notificationSettings.alertTypes.safety}
                                onChange={(e) => handleAlertTypeChange('safety', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="safety" className="font-medium text-gray-700 dark:text-dark-text-secondary">
                                Safety Alerts
                              </label>
                              <p className="text-gray-500 dark:text-dark-text-muted">
                                Emergency notifications, public safety announcements
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Privacy Tab */}
                  {activeTab === 'privacy' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-3">Location Settings</h4>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="shareLocation"
                                name="shareLocation"
                                type="checkbox"
                                checked={privacySettings.shareLocation}
                                onChange={(e) => handlePrivacyChange('shareLocation', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="shareLocation" className="font-medium text-gray-700 dark:text-dark-text-secondary">
                                Share Location
                              </label>
                              <p className="text-gray-500 dark:text-dark-text-muted">
                                Allow the app to access your current location for localized alerts and services
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex h-5 items-center">
                              <input
                                id="anonymousReporting"
                                name="anonymousReporting"
                                type="checkbox"
                                checked={privacySettings.anonymousReporting}
                                onChange={(e) => handlePrivacyChange('anonymousReporting', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="anonymousReporting" className="font-medium text-gray-700 dark:text-dark-text-secondary">
                                Anonymous Reporting
                              </label>
                              <p className="text-gray-500 dark:text-dark-text-muted">
                                Submit reports without sharing your personal information
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-3">Data Retention</h4>
                        <div className="mt-2">
                          <select
                            id="dataRetention"
                            name="dataRetention"
                            value={privacySettings.dataRetention}
                            onChange={(e) => handlePrivacyChange('dataRetention', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                          >
                            <option value="30-days">30 Days</option>
                            <option value="90-days">90 Days</option>
                            <option value="1-year">1 Year</option>
                            <option value="indefinite">Indefinite</option>
                          </select>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-dark-text-muted">
                          Choose how long we store your data and activity history
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                            Name
                          </label>
                          <input
                            type="text"
                            name="displayName"
                            id="displayName"
                            value={profile.displayName}
                            onChange={(e) => handleProfileChange('displayName', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="sm:col-span-3">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                            Email address
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={profile.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="sm:col-span-3">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                            Phone number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={profile.phone}
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="sm:col-span-6">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                            Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            value={profile.address}
                            onChange={(e) => handleProfileChange('address', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="sm:col-span-6">
                          <label htmlFor="notifications" className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                            Preferred notification method
                          </label>
                          <select
                            id="notifications"
                            name="notifications"
                            value={profile.notifications}
                            onChange={(e) => handleProfileChange('notifications', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                          >
                            <option value="email">Email</option>
                            <option value="text">Text message</option>
                            <option value="push">Push notification</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="pt-5">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                          >
                            Save changes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* About Tab */}
                  {activeTab === 'about' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-2">Smart City Dashboard</h4>
                        <p className="text-gray-600 dark:text-dark-text-secondary mb-4">
                          Version 1.0.0
                        </p>
                        <p className="text-gray-600 dark:text-dark-text-secondary">
                          The Smart City Dashboard provides real-time monitoring and management of urban infrastructure, 
                          environmental conditions, and city services. It helps citizens stay informed about their city 
                          and empowers them to report issues and track resolutions.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">Legal Information</h4>
                        <div className="space-y-2">
                          <a href="#" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                            Terms of Service
                          </a>
                          <a href="#" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                            Privacy Policy
                          </a>
                          <a href="#" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                            Data Usage Information
                          </a>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">Support</h4>
                        <div className="space-y-2">
                          <a href="#" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                            Help Center
                          </a>
                          <a href="#" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                            Contact Support
                          </a>
                          <a href="#" className="block text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                            Report a Bug
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 