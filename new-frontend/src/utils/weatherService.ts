import axios from 'axios';

// Using the API key from the provided list (mapweather)
const API_KEY = 'd7220ddbd8946f286b28c8179a53430c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  city: string;
  country: string;
  description: string;
  icon: string;
  temperature: number; // in Celsius
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  sunrise: number;
  sunset: number;
  timestamp: number;
}

// City coordinates for Indian cities
const CITY_COORDINATES = {
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
 * Get current weather data for a city
 * @param city City name
 * @returns Promise with weather data
 */
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    // Check if we have coordinates for this city
    const coords = CITY_COORDINATES[city];
    let url = '';
    
    if (coords) {
      // Use coordinates for more accurate results
      url = `${BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`;
    } else {
      // Fall back to city name
      url = `${BASE_URL}/weather?q=${city},in&appid=${API_KEY}&units=metric`;
    }
    
    const response = await axios.get(url);
    const data = response.data;
    
    return {
      city: data.name,
      country: data.sys.country,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      visibility: data.visibility,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timestamp: data.dt
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Get 5-day forecast for a city (3-hour intervals)
 * @param city City name
 * @returns Promise with forecast data
 */
export const getForecastByCity = async (city: string) => {
  try {
    // Check if we have coordinates for this city
    const coords = CITY_COORDINATES[city];
    let url = '';
    
    if (coords) {
      url = `${BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`;
    } else {
      url = `${BASE_URL}/forecast?q=${city},in&appid=${API_KEY}&units=metric`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
};

/**
 * Get the URL for a weather icon
 * @param iconCode Icon code from OpenWeather API
 * @returns URL to the icon image
 */
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Format a timestamp into a readable time string
 * @param timestamp Unix timestamp
 * @returns Formatted time string (e.g., "3:45 PM")
 */
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Format a date into a readable string
 * @param timestamp Unix timestamp
 * @returns Formatted date string (e.g., "Apr 15, 2023")
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Get weather description with first letter capitalized
 * @param description Weather description from API
 * @returns Capitalized description
 */
export const capitalizeDescription = (description: string): string => {
  return description.charAt(0).toUpperCase() + description.slice(1);
}; 