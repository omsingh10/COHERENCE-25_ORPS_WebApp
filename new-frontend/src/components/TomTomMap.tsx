import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Spinner,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  Flex,
  HStack,
  VStack,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FiAlertCircle, FiClock, FiNavigation, FiTruck } from 'react-icons/fi';
import { TOMTOM_API_KEY, TOMTOM_API_KEYS, switchToBackupApiKey, getTrafficIncidents, formatTrafficIncident } from '../utils/tomtomMapService';

// Declare the tt namespace for TypeScript
declare global {
  interface Window {
    tt: any;
    tomtomLoaded: boolean;
  }
}

interface TomTomMapProps {
  city: string;
  height?: string;
  width?: string;
  showTraffic?: boolean;
  showIncidents?: boolean;
}

const TomTomMap: React.FC<TomTomMapProps> = ({
  city,
  height = '500px',
  width = '100%',
  showTraffic = true,
  showIncidents = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // City coordinates mapping
  const cityCoordinates: Record<string, { lat: number; lon: number }> = {
    'Mumbai': { lat: 19.0760, lon: 72.8777 },
    'Delhi': { lat: 28.6139, lon: 77.2090 },
    'Bangalore': { lat: 12.9716, lon: 77.5946 },
    'Chennai': { lat: 13.0827, lon: 80.2707 },
    'Hyderabad': { lat: 17.3850, lon: 78.4867 },
    'Kolkata': { lat: 22.5726, lon: 88.3639 },
    'Pune': { lat: 18.5204, lon: 73.8567 },
    'Ahmedabad': { lat: 23.0225, lon: 72.5714 }
  };

  // Function to load TomTom SDK
  const loadTomTomSDK = () => {
    return new Promise<void>((resolve, reject) => {
      // If SDK is already loaded, resolve immediately
      if (window.tt && window.tomtomLoaded) {
        console.log('Maps SDK already loaded');
        resolve();
        return;
      }

      try {
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps.css';
        document.head.appendChild(link);

        // Load JS with proper error handling
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.23.0/maps/maps-web.min.js';
        script.async = true;
        script.defer = true;
        
        // Create a timeout for script loading
        const timeoutId = setTimeout(() => {
          console.warn('Maps SDK loading timed out, might be blocked by browser');
          script.onerror(new Error('Loading timed out'));
        }, 10000);
        
        script.onload = () => {
          clearTimeout(timeoutId);
          console.log('Maps SDK loaded successfully');
          window.tomtomLoaded = true;
          // Add a small delay to ensure the SDK is fully initialized
          setTimeout(() => resolve(), 500);
        };
        
        script.onerror = (err) => {
          clearTimeout(timeoutId);
          console.error('Failed to load Maps SDK', err);
          reject(new Error('Failed to load Maps SDK'));
        };
        
        document.body.appendChild(script);
      } catch (err) {
        console.error('Error setting up Maps SDK', err);
        reject(err);
      }
    });
  };

  // Initialize map with retry mechanism
  const initializeMap = async (retryCount = 0, currentApiKey = TOMTOM_API_KEY) => {
    if (!mapRef.current) return;
    
    // Clean up any existing map instance
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (err) {
        console.warn('Error removing existing map instance', err);
      }
      mapInstanceRef.current = null;
    }
    
    try {
      console.log('Initializing map for', city, 'with API key:', currentApiKey);
      
      // Check if window.tt is available
      if (!window.tt) {
        throw new Error('Maps SDK not available. Trying to load again...');
      }
      
      // Get coordinates for the city
      const coords = cityCoordinates[city];
      if (!coords) {
        throw new Error(`Coordinates not found for city: ${city}`);
      }
      
      // Initialize map options
      const mapOptions = {
        key: currentApiKey,
        container: mapRef.current,
        center: [coords.lon, coords.lat],
        zoom: 12,
        // Remove the style parameter which can cause issues
      };
      
      // Create map with enhanced error handling
      try {
        // Initialize the map without style first to ensure it loads
        mapInstanceRef.current = window.tt.map(mapOptions);
        
        console.log('Map instance created successfully');
        
        // Add traffic flow with error handling
        if (showTraffic) {
          mapInstanceRef.current.on('load', () => {
            try {
              // Only add traffic flow tier which is more reliable
              mapInstanceRef.current.addTier(window.tt.map.TileType.TRAFFIC_FLOW);
            } catch (err) {
              console.warn('Error adding traffic flow layer:', err);
              // Continue without traffic layers if they fail
            }
          });
        }
        
        // Add controls with error handling
        try {
          mapInstanceRef.current.addControl(new window.tt.NavigationControl({}));
        } catch (err) {
          console.warn('Error adding navigation control:', err);
        }
        
        try {
          mapInstanceRef.current.addControl(new window.tt.FullscreenControl({}));
        } catch (err) {
          console.warn('Error adding fullscreen control:', err);
        }
        
        // Fetch traffic incidents
        if (showIncidents) {
          // Use a timeout to ensure the map is fully loaded before fetching incidents
          setTimeout(async () => {
            try {
              if (!mapInstanceRef.current) return; // Safety check
              
              const incidentsData = await getTrafficIncidents(city);
              if (!mapInstanceRef.current) return; // Check again after async operation
              
              if (incidentsData && incidentsData.incidents && incidentsData.incidents.length > 0) {
                setIncidents(incidentsData.incidents);
                
                // Add incident markers
                incidentsData.incidents.forEach((incident: any) => {
                  try {
                    if (incident.geometry && incident.geometry.coordinates && mapInstanceRef.current) {
                      const coords = incident.geometry.coordinates;
                      const severity = incident.properties?.iconCategory || 'unknown';
                      
                      // Get the appropriate marker icon
                      let markerColor = '#FF0000';  // Default red
                      if (severity === 'minor') markerColor = '#FFA500'; // Orange
                      if (severity === 'moderate') markerColor = '#FFFF00'; // Yellow
                      
                      // Create a popup element
                      const popup = new window.tt.Popup({
                        offset: 35
                      }).setHTML(`
                        <div style="max-width: 200px;">
                          <strong>${incident.properties?.description || 'Traffic Incident'}</strong>
                          <p>Type: ${incident.type || 'Unknown'}</p>
                          <p>Location: ${incident.properties?.roadNumbers?.[0] || incident.properties?.street || 'Unknown'}</p>
                          ${incident.properties?.delay?.seconds ? `<p>Delay: ${Math.floor(incident.properties.delay.seconds / 60)} minutes</p>` : ''}
                        </div>
                      `);
                      
                      // Create and add the marker
                      try {
                        const marker = new window.tt.Marker({
                          color: markerColor
                        })
                          .setLngLat(coords[0]) // Use the first coordinate if it's a LineString
                          .setPopup(popup)
                          .addTo(mapInstanceRef.current);
                      } catch (markerErr) {
                        console.warn('Error adding marker:', markerErr);
                      }
                    }
                  } catch (incidentErr) {
                    console.warn('Error processing incident:', incidentErr);
                  }
                });
              }
            } catch (incidentErr) {
              console.error('Error fetching incidents:', incidentErr);
              // Don't fail the whole map if incidents can't be loaded
            }
          }, 1500); // Delay incident loading to ensure map is ready
        }
      } catch (mapErr) {
        console.error('Error creating map instance:', mapErr);
        throw mapErr;
      }

      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error initializing map:', err);
      
      // First attempt to use backup API key if current one failed and we're using primary
      if (currentApiKey === TOMTOM_API_KEYS.primary) {
        console.log('Primary API key failed, trying backup key');
        const backupKey = switchToBackupApiKey();
        try {
          return await initializeMap(retryCount, backupKey);
        } catch (backupError) {
          console.error('Backup API key also failed:', backupError);
        }
      }
      
      // If we haven't exceeded max retries, try again
      if (retryCount < 3) {
        console.log(`Retrying map initialization (attempt ${retryCount + 1})`);
        // Load SDK again before retrying
        try {
          await loadTomTomSDK();
          setTimeout(() => initializeMap(retryCount + 1, currentApiKey), 1000);
        } catch (sdkErr) {
          setError('Failed to load the map. Please check your internet connection and try again.');
          setLoading(false);
        }
      } else {
        setError('Failed to initialize the map. Please try again later.');
        setLoading(false);
      }
    }
  };

  // Effect for loading and initializing the map
  useEffect(() => {
    let isMounted = true;
    
    const setup = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setError(null);
      setIncidents([]);
      
      try {
        await loadTomTomSDK();
        if (isMounted) {
          // Small delay to ensure the SDK is fully loaded
          setTimeout(() => initializeMap(), 100);
        }
      } catch (err) {
        console.error('Map setup error:', err);
        if (isMounted) {
          setError('Failed to set up the map. Please try again later.');
          setLoading(false);
        }
      }
    };
    
    setup();
    
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (err) {
          console.warn('Error cleaning up map:', err);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [city, showTraffic, showIncidents]);

  // For severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'major': return 'red';
      case 'moderate': return 'orange';
      case 'minor': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <Box position="relative" key={`map-${city}-${showTraffic}-${showIncidents}`}>
      {loading && (
        <Flex 
          position="absolute"
          inset={0}
          bg="rgba(0, 0, 0, 0.1)"
          zIndex={10}
          justify="center"
          align="center"
          backdropFilter="blur(5px)"
        >
          <VStack spacing={3}>
            <Spinner size="xl" color="blue.500" />
            <Text>Loading map...</Text>
          </VStack>
        </Flex>
      )}
      
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Map container */}
      <Box 
        ref={mapRef} 
        height={height} 
        width={width} 
        borderRadius="lg" 
        overflow="hidden" 
        bg={bgColor}
        border="1px solid"
        borderColor={borderColor}
      />
      
      {/* Incidents sidebar - optionally can be displayed beside/below the map */}
      {showIncidents && incidents.length > 0 && (
        <Box mt={4} p={3} bg={bgColor} borderRadius="md" boxShadow="sm" borderColor={borderColor} borderWidth="1px">
          <Text fontWeight="bold" mb={2}>Traffic Incidents ({incidents.length})</Text>
          <VStack spacing={2} align="stretch" maxH="200px" overflowY="auto">
            {incidents.slice(0, 5).map((incident, index) => {
              const formattedIncident = formatTrafficIncident(incident);
              return (
                <Box 
                  key={index} 
                  p={2} 
                  borderRadius="md" 
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                >
                  <HStack spacing={2}>
                    <Icon as={FiAlertCircle} color={getSeverityColor(formattedIncident.severity) + ".500"} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="medium">{formattedIncident.description}</Text>
                      <HStack>
                        <Tooltip label="Location">
                          <HStack spacing={1}>
                            <Icon as={FiNavigation} boxSize={3} />
                            <Text fontSize="xs">{formattedIncident.location}</Text>
                          </HStack>
                        </Tooltip>
                        {formattedIncident.delay !== 'Unknown' && (
                          <Tooltip label="Delay">
                            <HStack spacing={1}>
                              <Icon as={FiClock} boxSize={3} />
                              <Text fontSize="xs">{formattedIncident.delay}</Text>
                            </HStack>
                          </Tooltip>
                        )}
                      </HStack>
                    </VStack>
                    <Badge colorScheme={getSeverityColor(formattedIncident.severity)}>
                      {formattedIncident.severity}
                    </Badge>
                  </HStack>
                </Box>
              );
            })}
            {incidents.length > 5 && (
              <Text fontSize="sm" color="gray.500" textAlign="center">
                + {incidents.length - 5} more incidents
              </Text>
            )}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default TomTomMap; 