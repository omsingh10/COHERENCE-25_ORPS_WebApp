import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Select,
  useColorModeValue,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  TabPanels,
  VStack,
  HStack,
  Badge,
  FormControl,
  FormLabel,
  Button,
  useToast,
} from '@chakra-ui/react';
import {
  FiHome,
  FiPieChart,
  FiMap,
  FiAlertCircle,
  FiSettings,
  FiBarChart2,
  FiFileText,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Import our new live components
import LiveChart from '../components/LiveChart';
import LiveMap from '../components/LiveMap';
import { getAllCities, getCityDataStream, getInitialCityData } from '../utils/realTimeData';
import { Subscription } from 'rxjs';

// Sidebar menu item
const SidebarItem = ({ icon, to, children, isActive = false }: { icon: React.ReactElement, to: string, children: React.ReactNode, isActive?: boolean }) => {
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.700', 'blue.200');
  const inactiveColor = useColorModeValue('gray.700', 'gray.200');
  
  return (
    <Link to={to}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : inactiveColor}
        fontWeight={isActive ? 'bold' : 'normal'}
        _hover={{
          bg: activeBg,
          color: activeColor,
        }}
      >
        {icon}
        <Text ml="4">{children}</Text>
      </Flex>
    </Link>
  );
};

// Sidebar component
const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      zIndex={10}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
          SmartCity
        </Text>
      </Flex>
      <VStack spacing={1} align="stretch" mt={5}>
        {isAdmin ? (
          // Admin sidebar items
          <>
            <SidebarItem icon={<FiPieChart size={18} />} to="/admin">Admin Dashboard</SidebarItem>
            <SidebarItem icon={<FiHome size={18} />} to="/users">User Management</SidebarItem>
            <SidebarItem icon={<FiAlertCircle size={18} />} to="/alerts">Alert Management</SidebarItem>
            <SidebarItem icon={<FiMap size={18} />} to="/city-map">City Map</SidebarItem>
            <SidebarItem icon={<FiPieChart size={18} />} to="/analytics" isActive>System Analytics</SidebarItem>
            <SidebarItem icon={<FiFileText size={18} />} to="/reports">Reports</SidebarItem>
            <SidebarItem icon={<FiSettings size={18} />} to="/settings">Settings</SidebarItem>
          </>
        ) : (
          // User sidebar items
          <>
            <SidebarItem icon={<FiHome size={18} />} to="/user-dashboard">Dashboard</SidebarItem>
            <SidebarItem icon={<FiPieChart size={18} />} to="/analytics" isActive>Analytics</SidebarItem>
            <SidebarItem icon={<FiMap size={18} />} to="/city-map">City Map</SidebarItem>
            <SidebarItem icon={<FiAlertCircle size={18} />} to="/alerts">Alerts</SidebarItem>
            <SidebarItem icon={<FiFileText size={18} />} to="/reports">Reports</SidebarItem>
            <SidebarItem icon={<FiSettings size={18} />} to="/settings">Settings</SidebarItem>
          </>
        )}
      </VStack>
    </Box>
  );
};

const Analytics = () => {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState(user?.city || 'Mumbai');
  const [activeTab, setActiveTab] = useState(0);
  const [airQualityData, setAirQualityData] = useState({
    aqi: 0,
    pm25: 0,
    pm10: 0,
    no2: 0,
    o3: 0
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  // Get all available cities
  const cities = getAllCities();
  
  // Default chart height
  const chartHeight = '300px';
  
  // Subscribe to city data changes for air quality indicators
  useEffect(() => {
    setLoading(true);
    
    // Get initial data
    const initialData = getInitialCityData(selectedCity);
    if (initialData && initialData.airQuality) {
      const latestAqi = initialData.airQuality[initialData.airQuality.length - 1];
      updateAirQualityData(latestAqi);
    }
    
    // Subscribe to real-time updates
    const subscription = getCityDataStream(selectedCity).subscribe({
      next: (data) => {
        if (data && data.airQuality) {
          const latestAqi = data.airQuality[data.airQuality.length - 1];
          updateAirQualityData(latestAqi);
        }
        setLoading(false);
      },
      error: (err) => {
        console.error('Error fetching city data:', err);
        toast({
          title: 'Error loading data',
          description: 'Unable to load real-time data. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [selectedCity, toast]);
  
  // Helper to update air quality data with derived values
  const updateAirQualityData = (aqi: number) => {
    // Generate related air quality metrics based on AQI
    // These are simulated values that would normally come from sensors
    setAirQualityData({
      aqi: Math.round(aqi),
      pm25: Math.round(aqi * 0.58),
      pm10: Math.round(aqi * 0.95),
      no2: Math.round(aqi * 0.25),
      o3: Math.round(aqi * 0.45)
    });
  };
  
  // Get color scheme based on value
  const getColorScheme = (value: number, type: string) => {
    if (type === 'aqi') {
      if (value < 50) return 'green';
      if (value < 100) return 'yellow';
      if (value < 150) return 'orange';
      if (value < 200) return 'red';
      return 'purple';
    } 
    else if (type === 'pm') {
      if (value < 30) return 'green';
      if (value < 60) return 'yellow';
      return 'orange';
    }
    else if (type === 'gas') {
      if (value < 20) return 'green';
      if (value < 40) return 'yellow';
      return 'orange';
    }
    return 'gray';
  };
  
  // Handle city change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    setLoading(true);
  };
  
  return (
    <Flex>
      {/* Sidebar - hidden on mobile */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Sidebar />
      </Box>
      
      {/* Main content area with left padding for sidebar */}
      <Box
        ml={{ base: 0, md: 60 }}
        p="4"
        width="full"
        bg={useColorModeValue('gray.50', 'gray.900')}
        minH="100vh"
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading as="h1" size="lg">Analytics Dashboard</Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')}>
              Comprehensive data analysis for {selectedCity}
            </Text>
          </Box>
          
          {(!user?.city || user?.role === 'admin') && (
            <FormControl w="200px">
              <Select 
                value={selectedCity} 
                onChange={handleCityChange}
                bg={useColorModeValue('white', 'gray.700')}
                borderRadius="lg"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
            </FormControl>
          )}
        </Flex>
        
        {/* Main Content Tabs */}
        <Tabs 
          colorScheme="blue" 
          variant="enclosed" 
          onChange={(index) => setActiveTab(index)}
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="lg"
          boxShadow="sm"
          mb={6}
        >
          <TabList px={4} pt={4}>
            <Tab _selected={{ bg: useColorModeValue('white', 'gray.700') }}>Overview</Tab>
            <Tab _selected={{ bg: useColorModeValue('white', 'gray.700') }}>Environment</Tab>
            <Tab _selected={{ bg: useColorModeValue('white', 'gray.700') }}>Traffic</Tab>
            <Tab _selected={{ bg: useColorModeValue('white', 'gray.700') }}>Resources</Tab>
          </TabList>
          
          <TabPanels>
            {/* Overview Tab */}
            <TabPanel>
              {/* Live Traffic Map */}
              <Box mb={6}>
                <LiveMap city={selectedCity} height="400px" />
              </Box>
              
              {/* Key Metrics */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
                <LiveChart 
                  city={selectedCity} 
                  dataType="airQuality" 
                  title="Air Quality Index" 
                  color="#ED8936" 
                  height={chartHeight} 
                />
                <LiveChart 
                  city={selectedCity} 
                  dataType="trafficDensity" 
                  title="Traffic Density" 
                  color="#E53E3E" 
                  height={chartHeight} 
                />
                <LiveChart 
                  city={selectedCity} 
                  dataType="waterLevel" 
                  title="Water Reservoir Levels" 
                  color="#3182CE" 
                  height={chartHeight} 
                />
                <LiveChart 
                  city={selectedCity} 
                  dataType="energyUsage" 
                  title="Energy Consumption" 
                  color="#38A169" 
                  height={chartHeight} 
                />
              </SimpleGrid>
            </TabPanel>
            
            {/* Environment Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                <LiveChart 
                  city={selectedCity} 
                  dataType="airQuality" 
                  title="Air Quality Index" 
                  color="#ED8936" 
                  height={chartHeight} 
                />
                <Card bg={useColorModeValue('white', 'gray.700')} boxShadow="sm" borderRadius="lg">
                  <CardHeader>
                    <Heading size="md">Air Quality Indicators</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="medium">Current AQI:</Text>
                        <Badge colorScheme={getColorScheme(airQualityData.aqi, 'aqi')} fontSize="md" px={2} py={1} borderRadius="md">
                          {airQualityData.aqi}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="medium">PM2.5:</Text>
                        <Badge colorScheme={getColorScheme(airQualityData.pm25, 'pm')} fontSize="md" px={2} py={1} borderRadius="md">
                          {airQualityData.pm25} µg/m³
                        </Badge>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="medium">PM10:</Text>
                        <Badge colorScheme={getColorScheme(airQualityData.pm10, 'pm')} fontSize="md" px={2} py={1} borderRadius="md">
                          {airQualityData.pm10} µg/m³
                        </Badge>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="medium">NO2:</Text>
                        <Badge colorScheme={getColorScheme(airQualityData.no2, 'gas')} fontSize="md" px={2} py={1} borderRadius="md">
                          {airQualityData.no2} ppb
                        </Badge>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="medium">O3:</Text>
                        <Badge colorScheme={getColorScheme(airQualityData.o3, 'gas')} fontSize="md" px={2} py={1} borderRadius="md">
                          {airQualityData.o3} ppb
                        </Badge>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
            
            {/* Traffic Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
                <LiveMap city={selectedCity} height="400px" />
                <LiveChart 
                  city={selectedCity} 
                  dataType="trafficDensity" 
                  title="Real-time Traffic Density" 
                  color="#E53E3E" 
                  height="400px" 
                />
              </SimpleGrid>
            </TabPanel>
            
            {/* Resources Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                <LiveChart 
                  city={selectedCity} 
                  dataType="waterLevel" 
                  title="Water Reservoir Levels" 
                  color="#3182CE" 
                  height={chartHeight} 
                />
                <LiveChart 
                  city={selectedCity} 
                  dataType="energyUsage" 
                  title="Energy Consumption" 
                  color="#38A169" 
                  height={chartHeight} 
                />
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Analytics; 