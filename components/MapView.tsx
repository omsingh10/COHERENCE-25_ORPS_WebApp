'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import of Leaflet to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('./Map'), { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">Loading map...</div>
});

export default function MapView() {
  return <MapWithNoSSR />;
} 