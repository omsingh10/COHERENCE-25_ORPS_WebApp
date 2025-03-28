'use client';

import { ElementType } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: ElementType;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  color: 'success' | 'warning' | 'danger';
}

export default function StatCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  trendValue, 
  color 
}: StatCardProps) {
  const getColorClass = () => {
    switch (color) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'danger':
        return 'text-danger-500';
      default:
        return 'text-gray-600';
    }
  };

  const getBgColorClass = () => {
    switch (color) {
      case 'success':
        return 'bg-green-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'danger':
        return 'bg-danger-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getIconClass = () => {
    switch (color) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'danger':
        return 'text-danger-500';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendClass = () => {
    if (trend === 'up') {
      return color === 'danger' ? 'text-danger-500' : 'text-green-500';
    } else if (trend === 'down') {
      return color === 'danger' ? 'text-green-500' : 'text-danger-500';
    } else {
      return 'text-gray-500';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') {
      return <ArrowUpIcon className="h-3 w-3" />;
    } else if (trend === 'down') {
      return <ArrowDownIcon className="h-3 w-3" />;
    } else {
      return null;
    }
  };

  return (
    <div className="card hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <div className={`${getBgColorClass()} p-2 rounded-lg`}>
          <Icon className={`h-5 w-5 ${getIconClass()}`} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline">
          <p className={`text-2xl font-semibold ${getColorClass()}`}>{value}</p>
          <p className="ml-1 text-sm font-medium text-gray-500">{unit}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className={`flex items-center text-xs ${getTrendClass()}`}>
          {getTrendIcon()}
          <span className="ml-1 font-medium">{trendValue}%</span>
          <span className="ml-1 text-gray-600">from previous hour</span>
        </div>
      </div>
    </div>
  );
} 