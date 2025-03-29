'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';

interface MapViewProps {
  city: string; // City name passed as a prop
}

// Dynamic import of Leaflet to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('./Map') as Promise<{ default: React.ComponentType<{ mapRef: any }> }>, { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">Loading map...</div>
});

export default function MapView({ city }: MapViewProps) {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (city && mapRef.current) {
      // Fetch coordinates for the city
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            const coordinates: LatLngExpression = [parseFloat(lat), parseFloat(lon)];
            mapRef.current.setView(coordinates, 12); // Update map view
          }
        })
        .catch((error) => console.error('Error fetching city coordinates:', error));
    }
  }, [city]);

  return <MapWithNoSSR mapRef={mapRef} />;
}