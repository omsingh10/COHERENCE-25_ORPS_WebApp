'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import AlertSystem from '@/components/AlertSystem';

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onSearch={(city) => console.log(`Searching for ${city}`)} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Dashboard />
          <AlertSystem />
        </main>
      </div>
    </div>
  );
} 