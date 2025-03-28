import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FiHome, FiPieChart, FiMap, FiAlertCircle, FiSettings, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
        <SidebarItem icon={<FiHome size={18} />} to="/user-dashboard">Dashboard</SidebarItem>
        <SidebarItem icon={<FiPieChart size={18} />} to="/analytics" isActive>Analytics</SidebarItem>
        <SidebarItem icon={<FiMap size={18} />} to="/city-map">City Map</SidebarItem>
        <SidebarItem icon={<FiAlertCircle size={18} />} to="/alerts">Alerts</SidebarItem>
        <SidebarItem icon={<FiSettings size={18} />} to="/settings">Settings</SidebarItem>
      </VStack>
    </Box>
  );
};

const Analytics = () => {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState(user?.city || 'Mumbai');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('all');
  
  // Mock data for charts
  const airQualityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'AQI',
        data: [25, 39, 60, 75, 40, 50, 80],
        borderColor: '#ED8936',
        backgroundColor: '#ED893633',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'PM2.5',
        data: [15, 29, 40, 55, 30, 40, 60],
        borderColor: '#9F7AEA',
        backgroundColor: '#9F7AEA33',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  
  const trafficData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Average Speed (km/h)',
        data: [45, 25, 30, 35, 28, 32, 50],
        borderColor: '#38A169',
        backgroundColor: '#38A16933',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Congestion Rate (%)',
        data: [10, 45, 40, 35, 42, 38, 15],
        borderColor: '#E53E3E',
        backgroundColor: '#E53E3E33',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const energyConsumptionData = {
    labels: ['Residential', 'Commercial', 'Industrial', 'Public Services', 'Transportation'],
    datasets: [
      {
        label: 'Energy Consumption by Sector',
        data: [35, 25, 22, 10, 8],
        backgroundColor: [
          '#4FD1C5',
          '#F6AD55',
          '#FC8181', 
          '#63B3ED',
          '#B794F4',
        ],
      },
    ],
  };
  
  const waterUsageData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Consumption (Million Liters)',
        data: [120, 115, 118, 125, 130, 140, 110],
        backgroundColor: '#3182CE',
      },
    ],
  };

  const comparisonData = {
    labels: ['Air Quality', 'Traffic', 'Water', 'Energy', 'Waste'],
    datasets: [
      {
        label: selectedCity,
        data: [65, 59, 90, 81, 56],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'National Average',
        data: [70, 65, 75, 70, 60],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
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
            <Text color="gray.600">Comprehensive data analysis for {selectedCity}</Text>
          </Box>
          
          <HStack spacing={4}>
            <FormControl w="150px">
              <Select 
                value={selectedTimeRange} 
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                bg="white"
                borderRadius="lg"
                size="sm"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </Select>
            </FormControl>
            
            <FormControl w="150px">
              <Select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                isDisabled={!!user?.city}
                bg="white"
                borderRadius="lg"
                size="sm"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
              </Select>
            </FormControl>

            <Button colorScheme="blue" size="sm">
              Export Report
            </Button>
          </HStack>
        </Flex>
        
        {/* Analytics Content */}
        <Tabs colorScheme="blue" variant="enclosed" bg="white" borderRadius="lg" boxShadow="sm">
          <TabList>
            <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>Overview</Tab>
            <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>Air Quality</Tab>
            <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>Traffic</Tab>
            <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>Water</Tab>
            <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>Energy</Tab>
            <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>Comparisons</Tab>
          </TabList>
          
          <TabPanels>
            {/* Overview Tab */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card borderRadius="lg">
                  <CardHeader>
                    <Heading size="md">Air Quality Trends</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box height="300px">
                      <Line 
                        data={airQualityData} 
                        options={{ 
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top' as const,
                            },
                            title: {
                              display: true,
                              text: `Air Quality Index Over Time (${selectedCity})`,
                            },
                          },
                        }} 
                      />
                    </Box>
                  </CardBody>
                </Card>
                
                <Card borderRadius="lg">
                  <CardHeader>
                    <Heading size="md">Traffic Conditions</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box height="300px">
                      <Line 
                        data={trafficData} 
                        options={{ 
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top' as const,
                            },
                            title: {
                              display: true,
                              text: `Weekly Traffic Patterns (${selectedCity})`,
                            },
                          },
                        }} 
                      />
                    </Box>
                  </CardBody>
                </Card>
                
                <Card borderRadius="lg">
                  <CardHeader>
                    <Heading size="md">Energy Consumption by Sector</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box height="300px">
                      <Pie 
                        data={energyConsumptionData} 
                        options={{ 
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'right' as const,
                            },
                            title: {
                              display: true,
                              text: `Energy Distribution (${selectedCity})`,
                            },
                          },
                        }} 
                      />
                    </Box>
                  </CardBody>
                </Card>
                
                <Card borderRadius="lg">
                  <CardHeader>
                    <Heading size="md">Water Usage</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box height="300px">
                      <Bar 
                        data={waterUsageData} 
                        options={{ 
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top' as const,
                            },
                            title: {
                              display: true,
                              text: `Daily Water Consumption (${selectedCity})`,
                            },
                          },
                        }} 
                      />
                    </Box>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
            
            {/* Air Quality Tab */}
            <TabPanel>
              <Card borderRadius="lg" mb={6}>
                <CardHeader>
                  <Heading size="md">Air Quality Analysis</Heading>
                </CardHeader>
                <CardBody>
                  <Box height="400px">
                    <Line 
                      data={airQualityData} 
                      options={{ 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top' as const,
                          },
                          title: {
                            display: true,
                            text: `Detailed Air Quality Metrics (${selectedCity})`,
                          },
                        },
                      }} 
                    />
                  </Box>
                </CardBody>
              </Card>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Card>
                  <CardHeader>
                    <Heading size="sm">AQI Assessment</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch">
                      <Text>Current AQI: <Badge colorScheme="yellow">72</Badge></Text>
                      <Text>30-day Average: <Badge colorScheme="yellow">68</Badge></Text>
                      <Text>Year-to-date Average: <Badge colorScheme="green">65</Badge></Text>
                      <Text>Trend: 5.3% increase from previous period</Text>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Heading size="sm">Pollutant Breakdown</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch">
                      <Text>PM2.5: <Badge colorScheme="orange">35 µg/m³</Badge></Text>
                      <Text>PM10: <Badge colorScheme="yellow">52 µg/m³</Badge></Text>
                      <Text>NO₂: <Badge colorScheme="green">18 ppb</Badge></Text>
                      <Text>SO₂: <Badge colorScheme="green">5 ppb</Badge></Text>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card>
                  <CardHeader>
                    <Heading size="sm">Health Advisory</Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>Current air quality is <strong>Moderate</strong>.</Text>
                    <Text mt={2}>
                      Unusually sensitive individuals should consider limiting prolonged outdoor exertion.
                    </Text>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
            
            {/* Traffic Tab */}
            <TabPanel>
              <Card borderRadius="lg" mb={6}>
                <CardHeader>
                  <Heading size="md">Traffic Analysis</Heading>
                </CardHeader>
                <CardBody>
                  <Box height="400px">
                    <Line 
                      data={trafficData} 
                      options={{ 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top' as const,
                          },
                          title: {
                            display: true,
                            text: `Traffic Metrics (${selectedCity})`,
                          },
                        },
                      }} 
                    />
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Other tabs would be similar */}
            <TabPanel>
              <Heading size="md">Water Analysis</Heading>
              <Text mt={4}>Detailed water analysis data would appear here.</Text>
            </TabPanel>
            
            <TabPanel>
              <Heading size="md">Energy Analysis</Heading>
              <Text mt={4}>Detailed energy analysis data would appear here.</Text>
            </TabPanel>
            
            <TabPanel>
              <Card borderRadius="lg">
                <CardHeader>
                  <Heading size="md">City Comparison</Heading>
                </CardHeader>
                <CardBody>
                  <Box height="400px">
                    <Bar 
                      data={comparisonData} 
                      options={{ 
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top' as const,
                          },
                          title: {
                            display: true,
                            text: `${selectedCity} vs National Average`,
                          },
                        },
                      }} 
                    />
                  </Box>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Analytics; 