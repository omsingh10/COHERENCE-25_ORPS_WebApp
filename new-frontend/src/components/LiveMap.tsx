import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, Heading, useColorModeValue, Spinner, Badge, Flex, HStack, useToast } from '@chakra-ui/react';
import { getCityDataStream, getInitialCityData, getCityCenter, TrafficPoint } from '../utils/realTimeData';
import { Subscription } from 'rxjs';

// We'll use leaflet for the map
// These are included in index.html:
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
// <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

interface LiveMapProps {
  city: string;
  height?: string | number;
}

// Define the Leaflet library type
declare global {
  interface Window {
    L: any; // Leaflet library
  }
}

const LiveMap: React.FC<LiveMapProps> = ({ city, height = '400px' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trafficPoints, setTrafficPoints] = useState<TrafficPoint[]>([]);
  const subscriptionRef = useRef<Subscription | null>(null);
  const toast = useToast();
  
  const mapId = `map-${Math.random().toString(36).substr(2, 9)}`;

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Get intensity color
  const getIntensityColor = (intensity: number) => {
    if (intensity < 30) return '#4CAF50'; // Green - low traffic
    if (intensity < 70) return '#FFC107'; // Yellow - medium traffic
    return '#F44336'; // Red - heavy traffic
  };
  
  // Format speed
  const formatSpeed = (speedKmh: number) => {
    return `${Math.round(speedKmh)} km/h`;
  };

  // Clean up previous map and subscription
  const cleanupMap = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }
    
    markersRef.current = [];
  };
  
  // Initialize map when component mounts or city changes
  useEffect(() => {
    // Ensure we have Leaflet available
    const checkLeaflet = () => {
      if (typeof window === 'undefined') return false;
      return window.L ? true : false;
    };

    // Set loading state
    setLoading(true);
    setError('');
    
    // Clean up previous map and subscription
    cleanupMap();
    
    const initMap = () => {
      try {
        console.log("Initializing map...");
        
        // Get city center coordinates
        const center = getCityCenter(city);
        if (!center) {
          setError(`City data not found for ${city}`);
          setLoading(false);
          return;
        }
        
        // Find the map container
        const mapContainer = document.getElementById(mapId);
        if (!mapContainer) {
          console.error("Map container not found:", mapId);
          setError('Map container not found. Please try refreshing the page.');
          setLoading(false);
          return;
        }
        
        console.log("Map container found:", mapId);
        
        // Initialize Leaflet map
        const map = window.L.map(mapId, {
          center: [center.lat, center.lng],
          zoom: 12,
          zoomControl: true
        });
        
        // Add OpenStreetMap tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Save map reference
        leafletMapRef.current = map;
        
        console.log("Map initialized successfully");
        
        // Get initial city data
        const initialData = getInitialCityData(city);
        if (initialData && initialData.trafficPoints) {
          setTrafficPoints(initialData.trafficPoints);
          updateMarkers(initialData.trafficPoints);
        }
        
        // Subscribe to city data updates
        subscriptionRef.current = getCityDataStream(city).subscribe({
          next: (data) => {
            if (data && data.trafficPoints) {
              setTrafficPoints(data.trafficPoints);
              updateMarkers(data.trafficPoints);
            }
            setLoading(false);
          },
          error: (err) => {
            console.error('Error fetching map data:', err);
            setError('Failed to get traffic data');
            toast({
              title: 'Error loading map data',
              description: 'Unable to load real-time traffic data. Please try again later.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            setLoading(false);
          }
        });
        
        // Force a resize event to ensure map renders correctly
        setTimeout(() => {
          if (leafletMapRef.current) {
            leafletMapRef.current.invalidateSize();
          }
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(`Failed to initialize map: ${err.message}`);
        setLoading(false);
      }
    };
    
    // Check if Leaflet is loaded
    if (!checkLeaflet()) {
      const maxAttempts = 10;
      let attempts = 0;
      
      const leafletCheckInterval = setInterval(() => {
        attempts++;
        if (checkLeaflet()) {
          clearInterval(leafletCheckInterval);
          console.log("Leaflet found after retries");
          // Small delay to ensure DOM is ready
          setTimeout(initMap, 100);
        } else if (attempts >= maxAttempts) {
          clearInterval(leafletCheckInterval);
          setError('Leaflet library not loaded. Please refresh the page.');
          setLoading(false);
        }
      }, 300);
    } else {
      // Small delay to ensure DOM is ready
      setTimeout(initMap, 100);
    }
    
    // Cleanup on unmount or when city changes
    return cleanupMap;
  }, [city, toast, mapId]);
  
  // Update markers on the map with new traffic data
  const updateMarkers = (points: TrafficPoint[]) => {
    if (!leafletMapRef.current || !window.L) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add new markers
    points.forEach(point => {
      const color = getIntensityColor(point.intensity);
      
      // Create circle marker
      const marker = window.L.circle([point.lat, point.lng], {
        color,
        fillColor: color,
        fillOpacity: 0.6,
        radius: 50 + (point.intensity * 2) // Size based on intensity
      }).addTo(leafletMapRef.current);
      
      // Add tooltip with traffic information
      marker.bindTooltip(
        `<strong>Traffic Info</strong><br>` +
        `Speed: ${formatSpeed(point.speedKmh)}<br>` +
        `Intensity: ${point.intensity}%<br>` +
        `Updated: ${new Date(point.timestamp).toLocaleTimeString()}`
      );
      
      markersRef.current.push(marker);
    });
  };
  
  return (
    <Box
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      boxShadow="sm"
    >
      <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
        <Heading size="md">Live Traffic Map - {city}</Heading>
        <HStack mt={2} spacing={4}>
          <Flex align="center">
            <Box w="12px" h="12px" borderRadius="full" bg="#4CAF50" mr={1} />
            <Text fontSize="sm">Light Traffic</Text>
          </Flex>
          <Flex align="center">
            <Box w="12px" h="12px" borderRadius="full" bg="#FFC107" mr={1} />
            <Text fontSize="sm">Moderate Traffic</Text>
          </Flex>
          <Flex align="center">
            <Box w="12px" h="12px" borderRadius="full" bg="#F44336" mr={1} />
            <Text fontSize="sm">Heavy Traffic</Text>
          </Flex>
        </HStack>
      </Box>
      
      {error ? (
        <Box p={8} textAlign="center">
          <Text color="red.500">{error}</Text>
        </Box>
      ) : loading ? (
        <Flex height={height} align="center" justify="center">
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text ml={3}>Loading map...</Text>
        </Flex>
      ) : (
        <Box>
          <Box
            id={mapId}
            height={height}
            width="100%"
            position="relative"
          />
          <Flex p={2} justify="space-between" bg={useColorModeValue('gray.50', 'gray.800')} fontSize="sm">
            <Text>Traffic Points: {trafficPoints.length}</Text>
            <Text>Last Updated: {new Date().toLocaleTimeString()}</Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default LiveMap; 