import React, { useEffect, useState, useRef } from 'react';
import { Box, Heading, useColorModeValue, Spinner, Flex, Text, Select } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { getCityDataStream, getInitialCityData } from '../utils/realTimeData';
import { Subscription } from 'rxjs';
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

// Register Chart.js components
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

interface LiveChartProps {
  city: string;
  dataType: 'airQuality' | 'trafficDensity' | 'waterLevel' | 'energyUsage';
  title: string;
  color: string;
  height?: string | number;
  yAxisLabel?: string;
}

// Map data types to labels and units
const dataTypeInfo: Record<string, { label: string; unit: string; min: number; max: number }> = {
  airQuality: { label: 'Air Quality Index', unit: 'AQI', min: 0, max: 300 },
  trafficDensity: { label: 'Traffic Density', unit: 'vehicles/h', min: 0, max: 800 },
  waterLevel: { label: 'Water Level', unit: '%', min: 0, max: 100 },
  energyUsage: { label: 'Energy Usage', unit: 'kWh', min: 0, max: 300 },
};

const LiveChart: React.FC<LiveChartProps> = ({ 
  city, 
  dataType, 
  title, 
  color, 
  height = '250px',
  yAxisLabel 
}) => {
  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState<'1h' | '3h' | '6h' | '12h'>('6h');
  const subscriptionRef = useRef<Subscription | null>(null);
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  
  // Generate time labels
  const generateTimeLabels = (count: number, interval: number) => {
    const now = new Date();
    const labels = [];
    
    // Start from the oldest time and move forward
    for (let i = 0; i < count; i++) {
      const time = new Date(now.getTime() - (count - 1 - i) * interval * 60000);
      labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    
    return labels;
  };
  
  // Filter data based on time range
  const getFilteredData = (data: number[]) => {
    let pointsToShow = 24; // 12 hours (30 min intervals)
    let interval = 30; // 30 minutes by default
    
    switch (timeRange) {
      case '1h':
        pointsToShow = 12; // 5 min intervals for 1 hour
        interval = 5;
        break;
      case '3h':
        pointsToShow = 18; // 10 min intervals for 3 hours
        interval = 10;
        break;
      case '6h':
        pointsToShow = 12; // 30 min intervals for 6 hours
        interval = 30;
        break;
      case '12h':
        pointsToShow = 24; // 30 min intervals for 12 hours
        interval = 30;
        break;
    }
    
    // Take the last `pointsToShow` points
    const filteredData = data.slice(-pointsToShow);
    const newLabels = generateTimeLabels(pointsToShow, interval);
    
    return { data: filteredData, labels: newLabels };
  };
  
  // Initialize data subscription
  useEffect(() => {
    setLoading(true);
    
    try {
      // Get initial data
      const initialData = getInitialCityData(city);
      if (initialData && initialData[dataType]) {
        const { data, labels } = getFilteredData(initialData[dataType]);
        setChartData(data);
        setLabels(labels);
      }
      
      // Subscribe to data updates
      subscriptionRef.current = getCityDataStream(city).subscribe(data => {
        if (data && data[dataType]) {
          const { data: filteredData, labels: newLabels } = getFilteredData(data[dataType]);
          setChartData(filteredData);
          setLabels(newLabels);
        }
      });
      
      setLoading(false);
    } catch (e) {
      console.error('Error loading chart data:', e);
      setError('Failed to load chart data');
      setLoading(false);
    }
    
    return () => {
      // Clean up subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [city, dataType, timeRange]);
  
  // Prepare chart configuration
  const chartConfig = {
    labels,
    datasets: [
      {
        label: dataTypeInfo[dataType]?.label || title,
        data: chartData,
        borderColor: color,
        backgroundColor: `${color}33`, // Color with transparency
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' ' + (dataTypeInfo[dataType]?.unit || '');
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: dataTypeInfo[dataType]?.min || 0,
        max: dataTypeInfo[dataType]?.max || undefined,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel || (dataTypeInfo[dataType]?.unit || ''),
        },
        ticks: {
          color: textColor,
        },
        grid: {
          color: useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)'),
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)'),
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };
  
  return (
    <Box
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      boxShadow="sm"
      height={typeof height === 'string' ? height : `${height}px`}
      display="flex"
      flexDirection="column"
    >
      <Flex p={4} borderBottomWidth="1px" borderColor={borderColor} justify="space-between" align="center">
        <Heading size="md">{title}</Heading>
        <Select
          size="sm"
          width="100px"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
        >
          <option value="1h">1 Hour</option>
          <option value="3h">3 Hours</option>
          <option value="6h">6 Hours</option>
          <option value="12h">12 Hours</option>
        </Select>
      </Flex>
      
      {error ? (
        <Flex flex="1" p={8} textAlign="center" align="center" justify="center">
          <Text color="red.500">{error}</Text>
        </Flex>
      ) : loading ? (
        <Flex flex="1" align="center" justify="center">
          <Spinner size="xl" color="blue.500" />
          <Text ml={3}>Loading data...</Text>
        </Flex>
      ) : (
        <Box flex="1" p={2}>
          <Line data={chartConfig} options={chartOptions} />
        </Box>
      )}
      
      <Flex p={2} justify="space-between" bg={useColorModeValue('gray.50', 'gray.800')} fontSize="sm">
        <Text>
          Current: {chartData.length > 0 ? chartData[chartData.length - 1].toFixed(1) : '0'} {dataTypeInfo[dataType]?.unit}
        </Text>
        <Text>
          Avg: {chartData.length > 0 ? (chartData.reduce((a, b) => a + b, 0) / chartData.length).toFixed(1) : '0'} {dataTypeInfo[dataType]?.unit}
        </Text>
      </Flex>
    </Box>
  );
};

export default LiveChart; 