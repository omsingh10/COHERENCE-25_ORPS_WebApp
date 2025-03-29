'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issues in Next.js
const fixLeafletIcon = () => {
  // Only run on client
  if (typeof window === 'undefined') return;

  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
};

// Custom Legend Control
class LegendControl extends L.Control {
  constructor(options?: L.ControlOptions) {
    super(options);
  }

  onAdd(map: L.Map): HTMLElement {
    const div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = `
      <div style="background-color: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="margin-bottom: 5px;"><b>Map Legend</b></div>
        <div style="margin-bottom: 5px;"><span style="display: inline-block; width: 10px; height: 10px; background-color: red; border-radius: 50%; margin-right: 5px;"></span> Heavy Traffic</div>
        <div style="margin-bottom: 5px;"><span style="display: inline-block; width: 10px; height: 10px; background-color: yellow; border-radius: 50%; margin-right: 5px;"></span> Moderate Traffic</div>
        <div style="margin-bottom: 5px;"><span style="display: inline-block; width: 10px; height: 10px; background-color: green; border-radius: 50%; margin-right: 5px;"></span> Normal Traffic</div>
        <div style="margin-bottom: 5px;"><span style="display: inline-block; width: 10px; height: 10px; background-color: blue; border-radius: 50%; margin-right: 5px;"></span> Flood Risk Area</div>
        <div><span style="display: inline-block; width: 10px; height: 10px; background-color: red; border-radius: 50%; margin-right: 5px;"></span> Air Quality Warning</div>
      </div>
    `;
    return div;
  }
}

type MapProps = {
  view?: 'traffic' | 'environment' | 'infrastructure';
};

export default function Map({ view = 'traffic' }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Function to clear existing layers
  const clearLayers = () => {
    if (mapRef.current && layerGroupRef.current) {
      mapRef.current.removeLayer(layerGroupRef.current);
    }
    layerGroupRef.current = L.layerGroup();
    if (mapRef.current) {
      layerGroupRef.current.addTo(mapRef.current);
    }
  };

  // Add traffic layer
  const addTrafficLayer = () => {
    if (!mapRef.current || !layerGroupRef.current) return;

    const redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const yellowIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    const greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Traffic congestion areas
    L.marker([40.7328, -73.9860], { icon: redIcon })
      .bindPopup('<b>Heavy Traffic</b><br>Broadway & 7th Avenue<br>Delay: 25 min')
      .addTo(layerGroupRef.current);

    L.marker([40.7228, -74.0060], { icon: yellowIcon })
      .bindPopup('<b>Moderate Traffic</b><br>Canal Street<br>Delay: 10 min')
      .addTo(layerGroupRef.current);

    L.marker([40.7028, -73.9860], { icon: greenIcon })
      .bindPopup('<b>Smooth Traffic</b><br>East Village<br>No delays')
      .addTo(layerGroupRef.current);

    // Traffic flow lines
    L.polyline([
      [40.7128, -74.006],
      [40.7228, -74.006],
      [40.7228, -73.9860],
      [40.7328, -73.9860],
    ], {
      color: 'orange',
      weight: 6,
      opacity: 0.7
    }).bindPopup('High volume traffic route').addTo(layerGroupRef.current);

    L.polyline([
      [40.7028, -73.9960],
      [40.7128, -73.9960],
      [40.7128, -73.9860],
    ], {
      color: 'green',
      weight: 6,
      opacity: 0.7
    }).bindPopup('Low volume traffic route').addTo(layerGroupRef.current);
  };

  // Add environment layer
  const addEnvironmentLayer = () => {
    if (!mapRef.current || !layerGroupRef.current) return;

    // Add a polygon for a flood warning area
    L.polygon([
      [40.7128, -74.016],
      [40.7228, -74.026],
      [40.7328, -74.016],
      [40.7228, -74.006],
    ], {
      color: 'blue',
      fillColor: 'rgba(0, 0, 255, 0.2)',
      fillOpacity: 0.5
    }).bindPopup('Flood warning area - Risk level: Moderate')
      .addTo(layerGroupRef.current);

    // Add circles for air quality
    L.circle([40.7228, -73.9760], {
      color: 'red',
      fillColor: 'rgba(255, 0, 0, 0.2)',
      fillOpacity: 0.5,
      radius: 500
    }).bindPopup('Poor air quality - AQI: 156')
      .addTo(layerGroupRef.current);

    L.circle([40.7028, -74.0160], {
      color: 'yellow',
      fillColor: 'rgba(255, 255, 0, 0.2)',
      fillOpacity: 0.5,
      radius: 400
    }).bindPopup('Moderate air quality - AQI: 85')
      .addTo(layerGroupRef.current);

    L.circle([40.7328, -74.0260], {
      color: 'green',
      fillColor: 'rgba(0, 255, 0, 0.2)',
      fillOpacity: 0.5,
      radius: 600
    }).bindPopup('Good air quality - AQI: 42')
      .addTo(layerGroupRef.current);

    // Add water features
    L.polygon([
      [40.7028, -73.9760],
      [40.7128, -73.9660],
      [40.7228, -73.9760],
      [40.7128, -73.9860],
    ], {
      color: 'blue',
      fillColor: 'rgba(0, 0, 255, 0.3)',
      fillOpacity: 0.5
    }).bindPopup('City Reservoir - Water Level: 85%')
      .addTo(layerGroupRef.current);
  };

  // Add infrastructure layer
  const addInfrastructureLayer = () => {
    if (!mapRef.current || !layerGroupRef.current) return;

    // Power grid
    L.polyline([
      [40.7128, -74.016],
      [40.7228, -74.006],
      [40.7328, -73.996],
    ], {
      color: 'yellow',
      weight: 3,
      dashArray: '5, 10',
      opacity: 0.8
    }).bindPopup('Power grid line - Load: 65%')
      .addTo(layerGroupRef.current);

    // Public transport routes
    L.polyline([
      [40.7028, -74.006],
      [40.7128, -73.996],
      [40.7228, -73.986],
      [40.7328, -73.976],
    ], {
      color: 'gray',
      weight: 4,
      opacity: 0.7
    }).bindPopup('Subway Line A - On schedule')
      .addTo(layerGroupRef.current);

    // Water infrastructure
    L.polyline([
      [40.7228, -74.026],
      [40.7128, -74.016],
      [40.7028, -74.006],
    ], {
      color: 'blue',
      weight: 3,
      dashArray: '5, 5',
      opacity: 0.7
    }).bindPopup('Water main - Pressure: Normal')
      .addTo(layerGroupRef.current);

    // Green spaces
    L.polygon([
      [40.7228, -73.976],
      [40.7328, -73.986],
      [40.7228, -73.996],
      [40.7128, -73.986],
    ], {
      color: 'green',
      fillColor: 'rgba(0, 128, 0, 0.2)',
      fillOpacity: 0.5
    }).bindPopup('City Park - Air quality: Good')
      .addTo(layerGroupRef.current);

    // Key infrastructure points
    const blueIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([40.7328, -73.996], { icon: blueIcon })
      .bindPopup('<b>Water Treatment Plant</b><br>Operational: 100%')
      .addTo(layerGroupRef.current);

    L.marker([40.7028, -74.026], { icon: blueIcon })
      .bindPopup('<b>Power Substation</b><br>Operational: 100%')
      .addTo(layerGroupRef.current);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix Leaflet icon paths
    fixLeafletIcon();

    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map(mapContainerRef.current).setView([40.7128, -74.006], 13);

      // Add Mapbox Streets tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Initialize layer group
      layerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    // Update layers based on view
    clearLayers();
    if (view === 'traffic') {
      addTrafficLayer();
    } else if (view === 'environment') {
      addEnvironmentLayer();
    } else if (view === 'infrastructure') {
      addInfrastructureLayer();
    }

    // Resize map to fit container
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      if (mapContainerRef.current) {
        resizeObserver.unobserve(mapContainerRef.current);
      }
    };
  }, [view]);

  return <div ref={mapContainerRef} className="h-full w-full rounded-lg" />;
} 