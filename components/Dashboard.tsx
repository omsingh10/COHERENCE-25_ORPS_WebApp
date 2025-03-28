'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import StatCard from './StatCard';
import DataChart from './DataChart';
import MapView from './MapView';
import ReportForm from './ReportForm';

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

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update with random fluctuations
      setAirQualityData(prev => {
        const lastValue = prev[prev.length - 1];
        const newValue = Math.max(0, Math.min(100, lastValue + (Math.random() - 0.5) * 10));
        return [...prev.slice(1), newValue];
      });
      
      setTrafficData(prev => {
        const lastValue = prev[prev.length - 1];
        const newValue = Math.max(0, Math.min(300, lastValue + (Math.random() - 0.5) * 40));
        return [...prev.slice(1), newValue];
      });
      
      setWaterLevelData(prev => {
        const lastValue = prev[prev.length - 1];
        const newValue = Math.max(0, Math.min(100, lastValue + (Math.random() - 0.5) * 8));
        return [...prev.slice(1), newValue];
      });
      
      setEnergyUsageData(prev => {
        const lastValue = prev[prev.length - 1];
        const newValue = Math.max(0, Math.min(500, lastValue + (Math.random() - 0.5) * 50));
        return [...prev.slice(1), newValue];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate summary stats
  const airQualityAvg = Math.round(airQualityData.reduce((a, b) => a + b, 0) / airQualityData.length);
  const trafficDensity = Math.round(trafficData.reduce((a, b) => a + b, 0) / trafficData.length);
  const waterLevelAvg = Math.round(waterLevelData.reduce((a, b) => a + b, 0) / waterLevelData.length);
  const energyUsageAvg = Math.round(energyUsageData.reduce((a, b) => a + b, 0) / energyUsageData.length);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">City Overview</h2>
      
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Air Quality Index" 
          value={airQualityAvg} 
          unit="AQI" 
          icon={CloudIcon} 
          trend={airQualityAvg > 60 ? 'up' : 'down'} 
          trendValue={Math.round((airQualityData[airQualityData.length - 1] - airQualityData[0]) / airQualityData[0] * 100)} 
          color={airQualityAvg > 70 ? 'danger' : airQualityAvg > 50 ? 'warning' : 'success'} 
        />
        <StatCard 
          title="Traffic Density" 
          value={trafficDensity} 
          unit="vehicles/h" 
          icon={TruckIcon} 
          trend={trafficDensity > 200 ? 'up' : 'down'} 
          trendValue={Math.round((trafficData[trafficData.length - 1] - trafficData[0]) / trafficData[0] * 100)} 
          color={trafficDensity > 250 ? 'danger' : trafficDensity > 180 ? 'warning' : 'success'} 
        />
        <StatCard 
          title="Water Reservoir" 
          value={waterLevelAvg} 
          unit="%" 
          icon={BuildingLibraryIcon} 
          trend={waterLevelAvg < 70 ? 'down' : 'up'} 
          trendValue={Math.round((waterLevelData[waterLevelData.length - 1] - waterLevelData[0]) / waterLevelData[0] * 100)} 
          color={waterLevelAvg < 60 ? 'danger' : waterLevelAvg < 75 ? 'warning' : 'success'} 
        />
        <StatCard 
          title="Energy Usage" 
          value={energyUsageAvg} 
          unit="MW" 
          icon={BoltIcon} 
          trend={energyUsageAvg > 350 ? 'up' : 'down'} 
          trendValue={Math.round((energyUsageData[energyUsageData.length - 1] - energyUsageData[0]) / energyUsageData[0] * 100)} 
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
          <MapView />
        </div>
      </div>
      
      {/* Report form */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Report an Issue</h3>
        <ReportForm />
      </div>
    </div>
  );
} 