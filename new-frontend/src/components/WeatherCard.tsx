import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Spinner,
  Image,
  HStack,
  VStack,
  Badge,
  Divider,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { FiDroplet, FiWind, FiSun, FiSunset, FiNavigation, FiEye } from 'react-icons/fi';
import { WiBarometer } from 'react-icons/wi';
import { 
  getWeatherByCity, 
  getWeatherIconUrl, 
  formatTime, 
  WeatherData,
  capitalizeDescription
} from '../utils/weatherService';

interface WeatherCardProps {
  city: string;
  variant?: 'detailed' | 'compact';
}

const WeatherCard: React.FC<WeatherCardProps> = ({ city, variant = 'detailed' }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherByCity(city);
        setWeather(data);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Set up interval to refresh data every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [city]);

  // Get weather condition badge color
  const getWeatherBadgeColor = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('drizzle')) return 'blue';
    if (desc.includes('cloud')) return 'gray';
    if (desc.includes('clear')) return 'yellow';
    if (desc.includes('snow')) return 'teal';
    if (desc.includes('thunderstorm')) return 'purple';
    if (desc.includes('fog') || desc.includes('mist')) return 'cyan';
    return 'green';
  };

  if (loading) {
    return (
      <Box 
        p={4} 
        borderWidth="1px" 
        borderRadius="lg" 
        borderColor={borderColor}
        bg={bgColor}
        boxShadow="sm"
        height={variant === 'compact' ? '120px' : '200px'}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner color="blue.500" size="md" mr={3} />
        <Text>Loading weather data...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        p={4} 
        borderWidth="1px" 
        borderRadius="lg" 
        borderColor="red.300"
        bg={bgColor}
        boxShadow="sm"
      >
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!weather) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <Box 
        p={3} 
        borderWidth="1px" 
        borderRadius="lg" 
        borderColor={borderColor}
        bg={bgColor}
        boxShadow="sm"
      >
        <Flex justify="space-between" align="center">
          <VStack align="flex-start" spacing={0}>
            <Text fontWeight="bold" fontSize="lg">{weather.city}</Text>
            <HStack>
              <Text fontSize="2xl" fontWeight="bold">
                {Math.round(weather.temperature)}°C
              </Text>
              <Badge colorScheme={getWeatherBadgeColor(weather.description)}>
                {capitalizeDescription(weather.description)}
              </Badge>
            </HStack>
          </VStack>
          <Image 
            src={getWeatherIconUrl(weather.icon)} 
            alt={weather.description}
            boxSize="60px"
          />
        </Flex>
      </Box>
    );
  }

  return (
    <Box 
      p={5} 
      borderWidth="1px" 
      borderRadius="lg" 
      borderColor={borderColor}
      bg={bgColor}
      boxShadow="sm"
    >
      <Flex justify="space-between" mb={3}>
        <VStack align="flex-start" spacing={0}>
          <Text fontWeight="bold" fontSize="xl">{weather.city}, {weather.country}</Text>
          <Text fontSize="sm" color={subtitleColor}>
            Updated at {formatTime(weather.timestamp)}
          </Text>
        </VStack>
        <Badge colorScheme={getWeatherBadgeColor(weather.description)} p={2} borderRadius="md">
          {capitalizeDescription(weather.description)}
        </Badge>
      </Flex>

      <Flex align="center" mb={4}>
        <Image 
          src={getWeatherIconUrl(weather.icon)} 
          alt={weather.description}
          boxSize="80px"
        />
        <VStack align="flex-start" spacing={0} ml={2}>
          <Text fontSize="4xl" fontWeight="bold" lineHeight="1">
            {Math.round(weather.temperature)}°C
          </Text>
          <Text fontSize="sm" color={subtitleColor}>
            Feels like {Math.round(weather.feelsLike)}°C
          </Text>
        </VStack>
      </Flex>

      <Divider mb={4} />

      <SimpleGrid columns={2} spacing={4}>
        <Stat size="sm">
          <Flex align="center">
            <Icon as={FiWind} mr={2} color="blue.500" />
            <StatLabel>Wind</StatLabel>
          </Flex>
          <StatNumber>{weather.windSpeed} m/s</StatNumber>
        </Stat>

        <Stat size="sm">
          <Flex align="center">
            <Icon as={FiDroplet} mr={2} color="blue.500" />
            <StatLabel>Humidity</StatLabel>
          </Flex>
          <StatNumber>{weather.humidity}%</StatNumber>
        </Stat>

        <Stat size="sm">
          <Flex align="center">
            <Icon as={FiSun} mr={2} color="orange.500" />
            <StatLabel>Sunrise</StatLabel>
          </Flex>
          <StatNumber>{formatTime(weather.sunrise)}</StatNumber>
        </Stat>

        <Stat size="sm">
          <Flex align="center">
            <Icon as={FiSunset} mr={2} color="orange.500" />
            <StatLabel>Sunset</StatLabel>
          </Flex>
          <StatNumber>{formatTime(weather.sunset)}</StatNumber>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default WeatherCard; 