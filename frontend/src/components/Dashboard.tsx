import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Select,
  useToast,
  Container,
  Flex,
  Text,
  Icon,
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorMode,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Center,
} from '@chakra-ui/react';
import { SearchIcon, TimeIcon } from '@chakra-ui/icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import AlertsPanel from './AlertsPanel';
import AdminPanel from './AdminPanel';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface SensorData {
  city: string;
  location: {
    coordinates: number[];
  };
  airQuality: {
    aqi: number;
    pm25: number;
    pm10: number;
  };
  traffic: {
    congestionLevel: number;
    vehicles: number;
  };
  waterLevel: {
    percentage: number;
  };
  energy: {
    usage: number;
  };
  timestamp: string;
}

interface TimeSeriesData {
  labels: string[];
  airQuality: number[];
  traffic: number[];
}

const Dashboard: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData>({
    labels: [],
    airQuality: [],
    traffic: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();
  const { user } = useAuth();
  const { colorMode } = useColorMode();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const indianCities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
  ];

  // City coordinates for the map
  const cityCoordinates: Record<string, [number, number]> = {
    Mumbai: [19.0760, 72.8777],
    Delhi: [28.6139, 77.2090],
    Bangalore: [12.9716, 77.5946],
    Hyderabad: [17.3850, 78.4867],
    Chennai: [13.0827, 80.2707],
    Kolkata: [22.5726, 88.3639],
  };

  useEffect(() => {
    const socket = io(API_URL);

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      socket.emit('subscribe', selectedCity);
    });

    socket.on('newSensorData', (data: SensorData) => {
      setSensorData(data);
      updateTimeSeriesData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedCity]);

  useEffect(() => {
    fetchSensorData();
    fetchTimeSeriesData();
  }, [selectedCity]);

  const fetchSensorData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/sensors/city/${selectedCity}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch sensor data');
      }
      
      const data = await response.json();
      setSensorData(data);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  const fetchTimeSeriesData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/api/sensors/historical/${selectedCity}?duration=24h`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }
      
      const data = await response.json();
      
      const formattedData = {
        labels: data.map((d: any) => new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        airQuality: data.map((d: any) => d.airQuality.aqi),
        traffic: data.map((d: any) => d.traffic.vehicles),
      };
      
      setTimeSeriesData(formattedData);
    } catch (error) {
      console.error('Error fetching time series data:', error);
    }
  };

  const updateTimeSeriesData = (newData: SensorData) => {
    setTimeSeriesData(prev => {
      // Only keep the last 24 data points
      const labels = [...prev.labels, new Date(newData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })].slice(-24);
      const airQuality = [...prev.airQuality, newData.airQuality.aqi].slice(-24);
      const traffic = [...prev.traffic, newData.traffic.vehicles].slice(-24);
      
      return { labels, airQuality, traffic };
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const foundCity = indianCities.find(
      city => city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (foundCity) {
      setSelectedCity(foundCity);
      setSearchQuery('');
    } else {
      toast({
        title: 'City not found',
        description: 'Please enter a valid Indian city name',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const airQualityChart = {
    labels: timeSeriesData.labels,
    datasets: [
      {
        label: 'Air Quality Index',
        data: timeSeriesData.airQuality,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.2,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const trafficChart = {
    labels: timeSeriesData.labels,
    datasets: [
      {
        label: 'Traffic Density (vehicles/h)',
        data: timeSeriesData.traffic,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.2,
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: colorMode === 'dark' ? 'white' : 'black',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: colorMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: colorMode === 'dark' ? 'white' : 'black',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: colorMode === 'dark' ? 'white' : 'black',
        },
      },
    },
  };

  // Mock data for initial display
  const mockData = {
    airQuality: {
      aqi: 70,
      change: 5,
    },
    traffic: {
      vehicles: 259,
      change: 0,
    },
    waterLevel: {
      percentage: 34,
      change: 0,
    },
    energy: {
      usage: 188,
      change: -33,
    },
  };

  const data = sensorData || {
    airQuality: { aqi: mockData.airQuality.aqi },
    traffic: { vehicles: mockData.traffic.vehicles },
    waterLevel: { percentage: mockData.waterLevel.percentage },
    energy: { usage: mockData.energy.usage },
  };

  if (user?.role === 'admin') {
    return <AdminPanel />;
  }

  return (
    <Box p={5}>
      <Heading mb={6}>Smart City Dashboard</Heading>
      
      <Text fontSize="xl" mb={4}>
        Welcome, {user?.name || 'User'}!
      </Text>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {/* Placeholder for actual dashboard components */}
        {Array(6).fill(0).map((_, i) => (
          <Box
            key={i}
            height="200px"
            bg="white"
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
          >
            <Heading size="md" mb={4}>
              {['Air Quality', 'Traffic Status', 'Energy Usage', 'Water Levels', 'Weather', 'Alerts'][i % 6]}
            </Heading>
            <Center h="100px">
              <Text>Data will appear here</Text>
            </Center>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard; 