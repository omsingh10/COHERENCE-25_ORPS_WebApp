'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import StatCard from './StatCard';
import DataChart from './DataChart';
import MapView from './MapView';

// Import heroicons
import {
  BuildingLibraryIcon,
  BoltIcon,
  CloudIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  // Mock data states
  const [airQualityData, setAirQualityData] = useState<number[]>([45, 52, 49, 60, 72, 58, 46, 50, 55]);
  const [trafficData, setTrafficData] = useState<number[]>([120, 150, 180, 220, 210, 190, 170, 160, 200]);
  const [waterLevelData, setWaterLevelData] = useState<number[]>([78, 82, 85, 76, 80, 83, 85, 79, 81]);
  const [energyUsageData, setEnergyUsageData] = useState<number[]>([300, 320, 280, 350, 380, 290, 310, 330, 320]);

  const [formData, setFormData] = useState({
    category: '',
    location: '',
    description: '',
    name: '',
    phone: '',
    email: '',
    priority: 'low',
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update with random fluctuations
      setAirQualityData((prev) => {
        const lastValue = prev[prev.length - 1];
        const newValue = Math.max(0, Math.min(100, lastValue + (Math.random() - 0.5) * 10));
        return [...prev.slice(1), newValue];
      });

      setTrafficData((prev) => {
        const lastValue = prev[prev.length - 1];
        const newValue = Math.max(0, Math.min(300, lastValue + (Math.random() - 0.5) * 40));
        return [...prev.slice(1), newValue];
      });

      setWaterLevelData((prev) => {
        const lastValue = prev[prev.length - 1];
        const newValue = Math.max(0, Math.min(100, lastValue + (Math.random() - 0.5) * 8));
        return [...prev.slice(1), newValue];
      });

      setEnergyUsageData((prev) => {
        const lastValue = prev[prev.length - 1];
        const newValue = Math.max(0, Math.min(500, lastValue + (Math.random() - 0.5) * 50));
        return [...prev.slice(1), newValue];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storedReports = JSON.parse(localStorage.getItem('reports') || '[]');
    const newReport = {
      ...formData,
      id: storedReports.length + 1,
      reportedAt: new Date().toISOString(),
      status: 'open',
    };

    localStorage.setItem('reports', JSON.stringify([newReport, ...storedReports]));

    // Reset the form
    setFormData({
      category: '',
      location: '',
      description: '',
      name: '',
      phone: '',
      email: '',
      priority: 'low',
    });

    alert('Report submitted successfully!');
  };

  // Calculate summary stats
  const airQualityAvg = Math.round(airQualityData.reduce((a, b) => a + b, 0) / airQualityData.length);
  const trafficDensity = Math.round(trafficData.reduce((a, b) => a + b, 0) / trafficData.length);
  const waterLevelAvg = Math.round(waterLevelData.reduce((a, b) => a + b, 0) / waterLevelData.length);
  const energyUsageAvg = Math.round(energyUsageData.reduce((a, b) => a + b, 0) / energyUsageData.length);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Air Quality Index"
          value={airQualityAvg}
          unit="AQI"
          icon={CloudIcon}
          trend={airQualityAvg > 60 ? 'up' : 'down'}
          trendValue={Math.round(((airQualityData[airQualityData.length - 1] - airQualityData[0]) / airQualityData[0]) * 100)}
          color={airQualityAvg > 70 ? 'danger' : airQualityAvg > 50 ? 'warning' : 'success'}
        />
        <StatCard
          title="Traffic Density"
          value={trafficDensity}
          unit="vehicles/h"
          icon={TruckIcon}
          trend={trafficDensity > 200 ? 'up' : 'down'}
          trendValue={Math.round(((trafficData[trafficData.length - 1] - trafficData[0]) / trafficData[0]) * 100)}
          color={trafficDensity > 250 ? 'danger' : trafficDensity > 180 ? 'warning' : 'success'}
        />
        <StatCard
          title="Water Reservoir"
          value={waterLevelAvg}
          unit="%"
          icon={BuildingLibraryIcon}
          trend={waterLevelAvg < 70 ? 'down' : 'up'}
          trendValue={Math.round(((waterLevelData[waterLevelData.length - 1] - waterLevelData[0]) / waterLevelData[0]) * 100)}
          color={waterLevelAvg < 60 ? 'danger' : waterLevelAvg < 75 ? 'warning' : 'success'}
        />
        <StatCard
          title="Energy Usage"
          value={energyUsageAvg}
          unit="MW"
          icon={BoltIcon}
          trend={energyUsageAvg > 350 ? 'up' : 'down'}
          trendValue={Math.round(((energyUsageData[energyUsageData.length - 1] - energyUsageData[0]) / energyUsageData[0]) * 100)}
          color={energyUsageAvg > 350 ? 'danger' : energyUsageAvg > 300 ? 'warning' : 'success'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Air Quality Monitoring</h3>
          <DataChart
            data={airQualityData}
            labels={['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']}
            color="rgb(14, 165, 233)"
            fillColor="rgba(14, 165, 233, 0.1)"
            unit="AQI"
          />
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Traffic Analysis</h3>
          <DataChart
            data={trafficData}
            labels={['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']}
            color="rgb(239, 68, 68)"
            fillColor="rgba(239, 68, 68, 0.1)"
            unit="vehicles/h"
          />
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Water Reservoir Levels</h3>
          <DataChart
            data={waterLevelData}
            labels={['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']}
            color="rgb(20, 184, 166)"
            fillColor="rgba(20, 184, 166, 0.1)"
            unit="%"
          />
        </div>
        <div className="card">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Energy Consumption</h3>
          <DataChart
            data={energyUsageData}
            labels={['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']}
            color="rgb(245, 158, 11)"
            fillColor="rgba(245, 158, 11, 0.1)"
            unit="MW"
          />
        </div>
      </div>

      {/* Map view */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-800 mb-4">City Map</h3>
        <div className="h-96">
          <MapView city="India" />
        </div>
      </div>

      {/* Report form */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Report an Issue</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Issue Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
            >
              <option value="">Select a category</option>
              <option value="Pothole">Pothole</option>
              <option value="Street Light">Street Light</option>
              <option value="Water Leak">Water Leak</option>
              <option value="Graffiti">Graffiti</option>
              <option value="Traffic Signal">Traffic Signal</option>
              <option value="Sidewalk Damage">Sidewalk Damage</option>
              <option value="Fallen Tree">Fallen Tree</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter address or describe location"
              className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Provide details about the issue..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Your phone number"
              className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Your email address"
              className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority Level
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}