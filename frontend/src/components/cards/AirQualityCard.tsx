import React from 'react';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  SimpleGrid,
  Progress,
  Text,
} from '@chakra-ui/react';

interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  no2?: number;
  so2?: number;
  co?: number;
}

interface Props {
  data: AirQualityData;
}

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return 'green.400';
  if (aqi <= 100) return 'yellow.400';
  if (aqi <= 150) return 'orange.400';
  if (aqi <= 200) return 'red.400';
  return 'purple.400';
};

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  return 'Very Unhealthy';
};

const AirQualityCard: React.FC<Props> = ({ data }) => {
  const aqiColor = getAQIColor(data.aqi);
  const aqiStatus = getAQIStatus(data.aqi);

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="sm">
      <Heading size="md" mb={4}>
        Air Quality
      </Heading>
      
      <Box mb={6}>
        <StatLabel mb={2}>Air Quality Index</StatLabel>
        <Progress
          value={data.aqi}
          max={300}
          colorScheme={aqiColor.split('.')[0]}
          height="32px"
          borderRadius="md"
        />
        <Stat mt={2}>
          <StatNumber color={aqiColor}>{data.aqi}</StatNumber>
          <StatHelpText>{aqiStatus}</StatHelpText>
        </Stat>
      </Box>

      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Text fontSize="sm" color="gray.500">
            PM2.5
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {data.pm25} µg/m³
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.500">
            PM10
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {data.pm10} µg/m³
          </Text>
        </Box>
        {data.no2 && (
          <Box>
            <Text fontSize="sm" color="gray.500">
              NO₂
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              {data.no2} ppb
            </Text>
          </Box>
        )}
        {data.so2 && (
          <Box>
            <Text fontSize="sm" color="gray.500">
              SO₂
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              {data.so2} ppb
            </Text>
          </Box>
        )}
        {data.co && (
          <Box>
            <Text fontSize="sm" color="gray.500">
              CO
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              {data.co} ppm
            </Text>
          </Box>
        )}
      </SimpleGrid>
    </Box>
  );
};

export default AirQualityCard; 