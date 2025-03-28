import axios from 'axios';

// Mappls/TomTom API keys - primary and backup
export const TOMTOM_API_KEYS = {
  primary: 'afc7a9e81a9116532857bb15e6ea3bb8', // Mappls API key from screenshot
  backup: 'REPLACE_WITH_VALID_API_KEY'  // Replace with a valid backup key if available
};

// Current active key - we'll start with the primary
export let TOMTOM_API_KEY = TOMTOM_API_KEYS.primary;

// Mappls Client ID/Secret for authentication (from the screenshot)
export const MAPPLS_CLIENT = {
  id: '96dHZVzAuvovhCtIRE437-lAS6MlksGdtvjo',
  secret: 'ir3x-i5Ee84c2LxOdXliIP5GDlVhZ-kx_ehrVbd.'
};

// Function to switch API keys when one fails
export const switchToBackupApiKey = () => {
  console.log('Switching to backup Map API key');
  TOMTOM_API_KEY = TOMTOM_API_KEYS.backup;
  return TOMTOM_API_KEY;
};

// Mappls API Base URLs
export const MAPPLS_API_BASE_URL = 'https://apis.mappls.com';
export const TOMTOM_API_BASE_URL = 'https://api.tomtom.com';

// City coordinates for major Indian cities (used as map centers)
export const CITY_COORDINATES = {
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Delhi': { lat: 28.6139, lon: 77.2090 },
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Ahmedabad': { lat: 23.0225, lon: 72.5714 }
};

/**
 * Get traffic incidents for a city with enhanced error handling
 * @param city City name
 * @param radius Radius in meters to search for incidents (default: 10000)
 * @returns Promise with traffic data
 */
export const getTrafficIncidents = async (city: string, radius: number = 10000) => {
  try {
    const coords = CITY_COORDINATES[city];
    if (!coords) {
      throw new Error(`No coordinates found for city: ${city}`);
    }

    console.log(`Fetching traffic incidents for ${city} with API key: ${TOMTOM_API_KEY}`);
    
    // Add a timeout to the axios request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const url = `${TOMTOM_API_BASE_URL}/traffic/services/5/incidentDetails`;
      const response = await axios.get(url, {
        params: {
          key: TOMTOM_API_KEY,
          bbox: `${coords.lon - 0.1},${coords.lat - 0.1},${coords.lon + 0.1},${coords.lat + 0.1}`,
          fields: '{incidents{type,geometry,properties}}',
          language: 'en-GB'
        },
        signal: controller.signal
      }).catch(async error => {
        // If request fails and we're using primary key, try with backup key
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        
        if (TOMTOM_API_KEY === TOMTOM_API_KEYS.primary) {
          console.log('Primary key failed, trying backup key');
          switchToBackupApiKey();
          return axios.get(url, {
            params: {
              key: TOMTOM_API_KEY,
              bbox: `${coords.lon - 0.1},${coords.lat - 0.1},${coords.lon + 0.1},${coords.lat + 0.1}`,
              fields: '{incidents{type,geometry,properties}}',
              language: 'en-GB'
            }
          });
        }
        throw error;
      });
      
      clearTimeout(timeoutId);
      console.log('Successfully fetched traffic incidents');
      return response.data;
    } catch (requestError) {
      clearTimeout(timeoutId);
      throw requestError;
    }
  } catch (error) {
    console.error('Error fetching traffic incidents:', error);
    
    // Return empty data structure instead of throwing to be more resilient
    return { incidents: [] };
  }
};

/**
 * Get traffic flow information for a city
 * @param city City name
 * @returns Promise with traffic flow data
 */
export const getTrafficFlow = async (city: string) => {
  try {
    const coords = CITY_COORDINATES[city];
    if (!coords) {
      throw new Error(`No coordinates found for city: ${city}`);
    }

    const url = `${TOMTOM_API_BASE_URL}/traffic/services/4/flowSegmentData/relative/10/json`;
    const response = await axios.get(url, {
      params: {
        key: TOMTOM_API_KEY,
        point: `${coords.lat},${coords.lon}`,
        radius: 10000
      }
    }).catch(async error => {
      // If request fails and we're using primary key, try with backup key
      if (TOMTOM_API_KEY === TOMTOM_API_KEYS.primary) {
        switchToBackupApiKey();
        return axios.get(url, {
          params: {
            key: TOMTOM_API_KEY,
            point: `${coords.lat},${coords.lon}`,
            radius: 10000
          }
        });
      }
      throw error;
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching traffic flow:', error);
    throw error;
  }
};

/**
 * Generate TomTom Map URL for embedding in iframes or direct usage
 * @param city City name
 * @param width Width of the map
 * @param height Height of the map
 * @param zoom Zoom level (default: 12)
 * @param showTraffic Whether to show traffic layer (default: true)
 * @returns URL to TomTom map
 */
export const generateMapUrl = (
  city: string, 
  width: number = 800, 
  height: number = 600, 
  zoom: number = 12, 
  showTraffic: boolean = true
): string => {
  const coords = CITY_COORDINATES[city];
  if (!coords) {
    console.error(`No coordinates found for city: ${city}`);
    // Default to Mumbai if city not found
    return `https://api.tomtom.com/map/1/staticimage?key=${TOMTOM_API_KEY}&center=72.8777,19.0760&zoom=${zoom}&width=${width}&height=${height}&layer=${showTraffic ? 'basic,traffic' : 'basic'}`;
  }
  
  return `https://api.tomtom.com/map/1/staticimage?key=${TOMTOM_API_KEY}&center=${coords.lon},${coords.lat}&zoom=${zoom}&width=${width}&height=${height}&layer=${showTraffic ? 'basic,traffic' : 'basic'}`;
};

/**
 * Get static map image URL
 * @param city City name
 * @param width Width of the map image
 * @param height Height of the map image
 * @param zoom Zoom level
 * @param showTraffic Whether to show traffic layer
 * @returns URL to static map image
 */
export const getStaticMapUrl = (
  city: string,
  width: number = 800,
  height: number = 600,
  zoom: number = 12,
  showTraffic: boolean = true
): string => {
  const coords = CITY_COORDINATES[city];
  if (!coords) {
    console.error(`No coordinates found for city: ${city}`);
    return `https://api.tomtom.com/map/1/staticimage?key=${TOMTOM_API_KEY}&center=72.8777,19.0760&zoom=${zoom}&width=${width}&height=${height}&layer=${showTraffic ? 'basic,traffic' : 'basic'}`;
  }
  
  return `https://api.tomtom.com/map/1/staticimage?key=${TOMTOM_API_KEY}&center=${coords.lon},${coords.lat}&zoom=${zoom}&width=${width}&height=${height}&layer=${showTraffic ? 'basic,traffic' : 'basic'}`;
};

/**
 * Format traffic incident data for display
 * @param incident The raw incident data
 * @returns Formatted incident object
 */
export const formatTrafficIncident = (incident: any) => {
  const properties = incident.properties || {};
  const geometry = incident.geometry || {};
  
  return {
    description: properties.description || 'Unknown incident',
    severity: properties.iconCategory || 'unknown',
    location: properties.roadNumbers?.[0] || properties.street || 'Unknown location',
    delay: properties.delay?.seconds 
      ? `${Math.floor(properties.delay.seconds / 60)} minutes` 
      : 'Unknown',
    coordinates: geometry.coordinates || []
  };
};

/**
 * Get color based on traffic speed
 * @param currentSpeed Current speed in km/h
 * @param freeFlowSpeed Free flow speed in km/h
 * @returns Color code for traffic visualization
 */
export const getTrafficColor = (currentSpeed: number, freeFlowSpeed: number): string => {
  const ratio = currentSpeed / freeFlowSpeed;
  
  if (ratio < 0.25) return '#FF0000'; // Red (heavy traffic)
  if (ratio < 0.5) return '#FFA500';  // Orange (slow traffic)
  if (ratio < 0.75) return '#FFFF00'; // Yellow (moderate traffic)
  return '#00FF00'; // Green (free flow)
}; 