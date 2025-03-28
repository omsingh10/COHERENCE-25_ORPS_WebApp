import { Subject, interval } from 'rxjs';
import { map } from 'rxjs/operators';

// Types definitions
export interface TrafficPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-100 scale
  speedKmh: number;
  timestamp: Date;
}

export interface CityData {
  airQuality: number[]; // Recent AQI values
  trafficDensity: number[]; // Recent traffic density values
  waterLevel: number[]; // Recent water reservoir level percentages
  energyUsage: number[]; // Recent energy consumption in kWh
  trafficPoints: TrafficPoint[]; // Real-time traffic data points
}

// Base data for Indian cities
const cityBaseData: Record<string, {
  center: { lat: number; lng: number };
  radius: number; // City radius in km (approximate)
  trafficPoints: number; // Number of traffic points to generate
  aqi: { base: number; variance: number };
  traffic: { base: number; variance: number };
  water: { base: number; variance: number };
  energy: { base: number; variance: number };
}> = {
  'Mumbai': {
    center: { lat: 19.0760, lng: 72.8777 },
    radius: 15,
    trafficPoints: 20,
    aqi: { base: 70, variance: 20 },
    traffic: { base: 425, variance: 100 },
    water: { base: 68, variance: 10 },
    energy: { base: 156, variance: 25 },
  },
  'Delhi': {
    center: { lat: 28.6139, lng: 77.2090 },
    radius: 20,
    trafficPoints: 25,
    aqi: { base: 150, variance: 40 },
    traffic: { base: 510, variance: 120 },
    water: { base: 45, variance: 15 },
    energy: { base: 190, variance: 30 },
  },
  'Bangalore': {
    center: { lat: 12.9716, lng: 77.5946 },
    radius: 15,
    trafficPoints: 18,
    aqi: { base: 65, variance: 15 },
    traffic: { base: 480, variance: 90 },
    water: { base: 72, variance: 8 },
    energy: { base: 140, variance: 20 },
  },
  'Chennai': {
    center: { lat: 13.0827, lng: 80.2707 },
    radius: 12,
    trafficPoints: 15,
    aqi: { base: 60, variance: 15 },
    traffic: { base: 350, variance: 80 },
    water: { base: 30, variance: 20 },
    energy: { base: 168, variance: 25 },
  },
  'Hyderabad': {
    center: { lat: 17.3850, lng: 78.4867 },
    radius: 14,
    trafficPoints: 18,
    aqi: { base: 65, variance: 15 },
    traffic: { base: 395, variance: 85 },
    water: { base: 62, variance: 12 },
    energy: { base: 152, variance: 22 },
  },
};

// Helper functions for data generation
const getRandomInRange = (base: number, variance: number): number => {
  return base + (Math.random() * 2 - 1) * variance;
};

const getRandomLocation = (center: { lat: number; lng: number }, radius: number): { lat: number; lng: number } => {
  // Convert radius from km to degrees (approximately)
  const radiusInDegrees = radius / 111;
  
  // Generate a random point within the circle
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.sqrt(Math.random()) * radiusInDegrees;
  
  return {
    lat: center.lat + distance * Math.cos(angle),
    lng: center.lng + distance * Math.sin(angle),
  };
};

// Generate initial city data
const generateInitialCityData = (): Record<string, CityData> => {
  const data: Record<string, CityData> = {};
  
  Object.entries(cityBaseData).forEach(([city, config]) => {
    // Generate 12 hours of historical data points (every 30 min)
    const hours = 12;
    const pointsPerHour = 2; // 30 min intervals
    const totalPoints = hours * pointsPerHour;
    
    const airQuality = Array(totalPoints).fill(0).map(() => 
      getRandomInRange(config.aqi.base, config.aqi.variance)
    );
    
    const trafficDensity = Array(totalPoints).fill(0).map(() => 
      getRandomInRange(config.traffic.base, config.traffic.variance)
    );
    
    const waterLevel = Array(totalPoints).fill(0).map(() => 
      getRandomInRange(config.water.base, config.water.variance)
    );
    
    const energyUsage = Array(totalPoints).fill(0).map(() => 
      getRandomInRange(config.energy.base, config.energy.variance)
    );
    
    // Generate traffic points
    const trafficPoints: TrafficPoint[] = Array(config.trafficPoints).fill(0).map(() => {
      const location = getRandomLocation(config.center, config.radius);
      return {
        lat: location.lat,
        lng: location.lng,
        intensity: Math.floor(Math.random() * 100),
        speedKmh: Math.floor(Math.random() * 80) + 5,
        timestamp: new Date()
      };
    });
    
    data[city] = {
      airQuality,
      trafficDensity,
      waterLevel,
      energyUsage,
      trafficPoints
    };
  });
  
  return data;
};

// Initialize data
let cityData = generateInitialCityData();

// Create subjects for real-time updates
const dataSubjects: Record<string, Subject<CityData>> = {};
Object.keys(cityData).forEach(city => {
  dataSubjects[city] = new Subject<CityData>();
});

// Function to update the city data with new values
const updateCityData = () => {
  Object.entries(cityData).forEach(([city, data]) => {
    const config = cityBaseData[city];
    
    // Shift arrays and add new values
    data.airQuality.shift();
    data.airQuality.push(getRandomInRange(config.aqi.base, config.aqi.variance));
    
    data.trafficDensity.shift();
    data.trafficDensity.push(getRandomInRange(config.traffic.base, config.traffic.variance));
    
    data.waterLevel.shift();
    data.waterLevel.push(getRandomInRange(config.water.base, config.water.variance));
    
    data.energyUsage.shift();
    data.energyUsage.push(getRandomInRange(config.energy.base, config.energy.variance));
    
    // Update traffic points
    data.trafficPoints = data.trafficPoints.map(point => {
      // Slightly move the point to simulate movement
      const moveFactor = Math.random() * 0.005 - 0.0025;
      return {
        ...point,
        lat: point.lat + moveFactor,
        lng: point.lng + moveFactor,
        intensity: Math.min(99, Math.max(1, point.intensity + (Math.random() * 20 - 10))),
        speedKmh: Math.min(90, Math.max(5, point.speedKmh + (Math.random() * 10 - 5))),
        timestamp: new Date()
      };
    });
    
    // Every few updates, add or remove a traffic point to simulate dynamic traffic
    if (Math.random() > 0.7) {
      if (data.trafficPoints.length < config.trafficPoints + 10 && Math.random() > 0.5) {
        // Add a new traffic point
        const location = getRandomLocation(config.center, config.radius);
        data.trafficPoints.push({
          lat: location.lat,
          lng: location.lng,
          intensity: Math.floor(Math.random() * 100),
          speedKmh: Math.floor(Math.random() * 80) + 5,
          timestamp: new Date()
        });
      } else if (data.trafficPoints.length > config.trafficPoints - 5) {
        // Remove a random traffic point
        const indexToRemove = Math.floor(Math.random() * data.trafficPoints.length);
        data.trafficPoints.splice(indexToRemove, 1);
      }
    }
    
    // Emit updated data
    dataSubjects[city].next({...data});
  });
};

// Set up interval to update data
const updateInterval = 5000; // 5 seconds
interval(updateInterval).subscribe(() => {
  updateCityData();
});

// Public API
export const getCityDataStream = (city: string) => {
  return dataSubjects[city].asObservable();
};

export const getAllCities = () => Object.keys(cityBaseData);

export const getCityCenter = (city: string) => cityBaseData[city]?.center;

export const getInitialCityData = (city: string) => cityData[city];

// Export a function to manually trigger a data update (useful for testing)
export const triggerDataUpdate = () => {
  updateCityData();
}; 