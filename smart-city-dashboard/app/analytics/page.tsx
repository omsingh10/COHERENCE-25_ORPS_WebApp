'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DataChart from '@/components/DataChart';
import { 
  PresentationChartLineIcon, 
  UserGroupIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  
  // Mock data for different analytics
  const [trafficTrends, setTrafficTrends] = useState<number[]>([320, 302, 301, 334, 390, 330, 320]);
  const [energyEfficiency, setEnergyEfficiency] = useState<number[]>([78, 81, 80, 85, 88, 87, 85]);
  const [waterConsumption, setWaterConsumption] = useState<number[]>([120, 132, 101, 134, 90, 130, 120]);
  const [publicTransport, setPublicTransport] = useState<number[]>([520, 532, 501, 534, 590, 520, 550]);

  // Historical data for comparisons
  const [historicalData, setHistoricalData] = useState({
    dailyAvgTraffic: 320,
    peakHours: '08:00 - 09:30',
    transportUsage: 3200,
    energySavings: 12.5
  });

  // Day labels for charts
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Week labels for charts
  const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'];
  
  // Month labels for charts
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  // Get appropriate labels based on time range
  const getLabels = () => {
    switch(timeRange) {
      case 'day': return dayLabels;
      case 'week': return weekLabels;
      case 'month': return monthLabels;
      default: return dayLabels;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onSearch={(city: string) => console.log(`Searching for ${city}`)} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-dark-bg">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text-primary">City Analytics</h2>
              
              {/* Time range selector */}
              <div className="mt-4 md:mt-0 flex space-x-2 bg-white dark:bg-dark-card rounded-lg shadow-sm p-1">
                <button 
                  onClick={() => setTimeRange('day')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    timeRange === 'day' 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                      : 'text-gray-600 dark:text-dark-text-secondary'
                  }`}
                >
                  Daily
                </button>
                <button 
                  onClick={() => setTimeRange('week')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    timeRange === 'week' 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                      : 'text-gray-600 dark:text-dark-text-secondary'
                  }`}
                >
                  Weekly
                </button>
                <button 
                  onClick={() => setTimeRange('month')}
                  className={`px-4 py-2 text-sm font-medium rounded ${
                    timeRange === 'month' 
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
                      : 'text-gray-600 dark:text-dark-text-secondary'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            {/* Key insights cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Daily Average Traffic</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-dark-text-primary">{historicalData.dailyAvgTraffic}</p>
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400">↓ 8% from last month</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <PresentationChartLineIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Peak Traffic Hours</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-dark-text-primary">{historicalData.peakHours}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">No change from last week</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Public Transport Usage</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-dark-text-primary">{historicalData.transportUsage}</p>
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400">↑ 12% from last month</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <UserGroupIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary">Energy Savings</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-800 dark:text-dark-text-primary">{historicalData.energySavings}%</p>
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400">↑ 3.2% from last month</p>
                  </div>
                  <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-full">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-4">Traffic Trends</h3>
                <DataChart 
                  data={trafficTrends} 
                  labels={getLabels()} 
                  color="rgb(37, 99, 235)" 
                  fillColor="rgba(37, 99, 235, 0.1)" 
                  unit="vehicles/h" 
                />
              </div>
              
              <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-4">Energy Efficiency</h3>
                <DataChart 
                  data={energyEfficiency} 
                  labels={getLabels()} 
                  color="rgb(16, 185, 129)" 
                  fillColor="rgba(16, 185, 129, 0.1)" 
                  unit="%" 
                />
              </div>
              
              <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-4">Water Consumption</h3>
                <DataChart 
                  data={waterConsumption} 
                  labels={getLabels()} 
                  color="rgb(14, 165, 233)" 
                  fillColor="rgba(14, 165, 233, 0.1)" 
                  unit="K gallons" 
                />
              </div>
              
              <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary mb-4">Public Transport Usage</h3>
                <DataChart 
                  data={publicTransport} 
                  labels={getLabels()} 
                  color="rgb(124, 58, 237)" 
                  fillColor="rgba(124, 58, 237, 0.1)" 
                  unit="passengers" 
                />
              </div>
            </div>
            
            {/* Data table */}
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-border">
                <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text-primary">Detailed Analytics</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                  <thead className="bg-gray-50 dark:bg-dark-card">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Metric</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Current</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Previous</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Change</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">Traffic Flow</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">320 vehicles/h</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">347 vehicles/h</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">-7.8%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">Energy Usage</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">285 MW</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">320 MW</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">-10.9%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">Air Quality</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">42 AQI</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">56 AQI</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">-25.0%</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">Water Usage</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">125K gallons</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">132K gallons</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">-5.3%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 