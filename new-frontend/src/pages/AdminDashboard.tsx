import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
  useColorModeValue,
  Select,
  Stack,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
  Icon,
  Progress,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { FiPlus, FiUser, FiUsers, FiAlertCircle, FiBarChart2, FiMap, FiSettings, FiLock, FiFileText, FiTrendingUp, FiDroplet, FiActivity, FiSun, FiWind } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import WeatherCard from '../components/WeatherCard';
import TomTomMap from '../components/TomTomMap';
import Sidebar from '../components/Sidebar';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// India Energy API configuration
const ENERGY_API_KEY = "6P1fGUphniT5LQFPMsQq";
const ENERGY_API_ENDPOINT = "https://api.electricitymap.org/v3/carbon-intensity/latest?zone=IN-NE";

// Mock cities data
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];

// Mock data for system stats
const systemStats = [
  { title: 'Active Users', value: 8723, change: 12.3, color: 'blue.500', icon: <FiUser /> },
  { title: 'Active Alerts', value: 142, change: -5.8, color: 'orange.500', icon: <FiAlertCircle /> },
  { title: 'Server Uptime', value: 99.98, unit: '%', change: 0.2, color: 'green.500', icon: <FiBarChart2 /> },
  { title: 'Data Storage', value: 684, unit: ' GB', change: 8.7, color: 'purple.500', icon: <FiBarChart2 /> },
];

// Mock data for alerts
const recentAlerts = [
  { id: 1, city: 'Mumbai', type: 'Air Quality', severity: 'high', message: 'AQI levels exceeding threshold in central districts', time: '15 min ago' },
  { id: 2, city: 'Delhi', type: 'Traffic', severity: 'medium', message: 'Congestion reported on major highways', time: '30 min ago' },
  { id: 3, city: 'Bangalore', type: 'Water', severity: 'high', message: 'Water shortage detected in eastern zones', time: '45 min ago' },
  { id: 4, city: 'Chennai', type: 'Power', severity: 'low', message: 'Brief power fluctuations expected during system maintenance', time: '1 hr ago' },
  { id: 5, city: 'Hyderabad', type: 'Security', severity: 'medium', message: 'Unauthorized access attempts detected', time: '2 hrs ago' },
];

// Mock data for users
const recentUsers = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh.k@example.com', city: 'Mumbai', role: 'City Admin', status: 'active' },
  { id: 2, name: 'Priya Singh', email: 'priya.s@example.com', city: 'Delhi', role: 'Analyst', status: 'active' },
  { id: 3, name: 'Amit Patel', email: 'amit.p@example.com', city: 'Bangalore', role: 'User', status: 'inactive' },
  { id: 4, name: 'Sunita Sharma', email: 'sunita.s@example.com', city: 'Chennai', role: 'City Admin', status: 'active' },
  { id: 5, name: 'Karthik R', email: 'karthik.r@example.com', city: 'Hyderabad', role: 'Analyst', status: 'pending' },
];

// Chart data
const usersByCity = {
  labels: cities,
  datasets: [
    {
      label: 'Registered Users',
      data: [2430, 3500, 1980, 1450, 1200, 980, 890, 760],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)',
      ],
    },
  ],
};

const alertsByType = {
  labels: ['Air Quality', 'Traffic', 'Water', 'Power', 'Security', 'Infrastructure'],
  datasets: [
    {
      label: 'Alerts by Type',
      data: [45, 32, 28, 19, 12, 6],
      backgroundColor: [
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(75, 192, 192, 0.7)',
      ],
      borderWidth: 1,
    },
  ],
};

// Component for statistical card
interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  change: number;
  color: string;
  icon?: React.ReactElement;
}

const StatCard = ({ title, value, unit = '', change, color, icon }: StatCardProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <Card bg={bgColor} boxShadow="sm" borderRadius="lg">
      <CardBody>
        <Flex align="center">
          {icon && (
            <Flex
              w="40px"
              h="40px"
              align="center"
              justify="center"
              borderRadius="12px"
              bg={`${color}10`}
              color={color}
              fontSize="xl"
              mr={3}
            >
              {icon}
            </Flex>
          )}
          <Box>
            <Text color="gray.500" fontSize="sm" fontWeight="medium">
              {title}
            </Text>
            <Stat>
              <StatNumber color={color} fontSize="2xl" fontWeight="bold">
                {value}{unit}
              </StatNumber>
              <StatHelpText mb={0}>
                <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(change)}% from last month
              </StatHelpText>
            </Stat>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

// India Energy Card Component
const IndiaEnergyCard = () => {
  const [carbonIntensity, setCarbonIntensity] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        setLoading(true);
        // In a real app, you would make a direct API call
        // Since we can't make real external API calls in this environment, we'll simulate a response
        // const response = await fetch(ENERGY_API_ENDPOINT, {
        //   headers: {
        //     'auth-token': ENERGY_API_KEY
        //   }
        // });
        // const data = await response.json();
        
        // Mock response data
        const mockData = {
          carbonIntensity: 476, // gCO2eq/kWh
          datetime: new Date().toISOString(),
        };
        
        // Simulate network delay
        setTimeout(() => {
          setCarbonIntensity(mockData.carbonIntensity);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch energy data');
        setLoading(false);
        console.error('Error fetching energy data:', err);
      }
    };

    fetchEnergyData();
  }, []);

  const bgColor = useColorModeValue('white', 'gray.700');

  // Determine color based on carbon intensity value
  const getColorForIntensity = (value: number) => {
    if (value < 200) return 'green.500';
    if (value < 400) return 'yellow.500';
    if (value < 600) return 'orange.500';
    return 'red.500';
  };

  return (
    <Card bg={bgColor} boxShadow="sm" borderRadius="lg">
      <CardHeader>
        <Heading size="md">India Energy Carbon Intensity</Heading>
      </CardHeader>
      <CardBody>
        {loading ? (
          <Flex justify="center" align="center" height="100px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Flex direction="column" align="center">
            <Text color="gray.500" fontSize="sm">Current Carbon Intensity</Text>
            <Stat textAlign="center">
              <StatNumber 
                color={getColorForIntensity(carbonIntensity || 0)} 
                fontSize="3xl" 
                fontWeight="bold"
              >
                {carbonIntensity} <Text as="span" fontSize="lg">gCO2eq/kWh</Text>
              </StatNumber>
              <StatHelpText>
                North-Eastern India Grid
              </StatHelpText>
              <Badge 
                colorScheme={carbonIntensity && carbonIntensity > 400 ? 'red' : 'green'}
                px={3}
                py={1}
                borderRadius="full"
              >
                {carbonIntensity && carbonIntensity > 400 ? 'High Carbon Intensity' : 'Moderate Carbon Intensity'}
              </Badge>
            </Stat>
            <Text fontSize="xs" mt={4} color="gray.500">
              Source: ElectricityMap.org API • Key: {ENERGY_API_KEY.substring(0, 5)}...
            </Text>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

const AdminDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [activeTab, setActiveTab] = useState(0);
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const selectBg = useColorModeValue('white', 'gray.700');
  
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };
  
  // Alert badge colors based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      default: return 'gray';
    }
  };
  
  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };
  
  return (
    <Box>
      <Sidebar />
      <Box
        ml={{ base: 0, md: 60 }}
        pt={{ base: "20", md: 6 }}
        px={4}
        width="full"
        bg={useColorModeValue('gray.50', 'gray.900')}
        minH="100vh"
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading as="h1" size="lg">Admin Dashboard</Heading>
            <Text color="gray.600">System overview and management</Text>
          </Box>
          
          <Select maxW="200px" placeholder="Select time range" bg={cardBg}>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </Select>
        </Flex>
        
        {/* System Stats */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5} mb={6}>
          {systemStats.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title} 
              value={stat.value} 
              unit={stat.unit}
              change={stat.change} 
              color={stat.color} 
              icon={stat.icon}
            />
          ))}
        </SimpleGrid>
        
        {/* City Selector */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" mb={6}>
          <CardBody>
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }}>
              <Box mb={{ base: 4, md: 0 }}>
                <Heading size="md" mb={1}>City Overview</Heading>
                <Text color={subtitleColor}>Select a city to view statistics</Text>
              </Box>
              <Box width={{ base: '100%', md: '200px' }}>
                <Select 
                  value={selectedCity} 
                  onChange={handleCityChange} 
                  bg={selectBg}
                  borderColor={borderColor}
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Select>
              </Box>
            </Flex>
          </CardBody>
        </Card>
        
        {/* Weather Card for Selected City */}
        <Box mb={6}>
          <WeatherCard city={selectedCity} />
        </Box>
        
        {/* Traffic Map */}
        <Box mb={6}>
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" overflow="hidden">
            <CardBody p={0}>
              <Box position="relative">
                <TomTomMap 
                  city={selectedCity} 
                  height="400px" 
                  showTraffic={true} 
                  showIncidents={true} 
                />
                <Box 
                  position="absolute" 
                  top={3} 
                  right={3} 
                  bg={cardBg} 
                  py={1} 
                  px={3} 
                  borderRadius="md" 
                  fontSize="sm"
                  boxShadow="md"
                  borderWidth="1px"
                  borderColor={borderColor}
                  zIndex={10}
                >
                  <Heading size="xs" mb={1}>Live Traffic</Heading>
                  <Text fontSize="xs" color={subtitleColor}>
                    Showing real-time traffic for {selectedCity}
                  </Text>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
        
        {/* System Overview Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <StatCard
            title="Total Users"
            value={8723}
            icon={FiUsers}
            description="+132 this week"
            color="purple.500"
          />
          <StatCard
            title="Active Cities"
            value={6}
            icon={FiMap}
            description="100% uptime"
            color="blue.500"
          />
          <StatCard
            title="Active Alerts"
            value={142}
            icon={FiAlertCircle}
            description="8 high priority"
            color="red.500"
          />
          <StatCard
            title="System Health"
            value={99.98}
            unit="%"
            icon={FiActivity}
            description="All systems operational"
            color="green.500"
          />
        </SimpleGrid>
        
        {/* City Specific Stats */}
        <Heading size="md" mb={4} color={textColor}>
          {selectedCity} Statistics
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <StatCard
            title="Air Quality"
            value={65}
            icon={FiWind}
            description="Moderate"
            color="yellow.500"
          />
          <StatCard
            title="Traffic Flow"
            value={78}
            unit="%"
            icon={FiActivity}
            description="3 congestion points"
            color="orange.500"
          />
          <StatCard
            title="Energy Usage"
            value={52.7}
            unit="MW"
            icon={FiSun}
            description="+3.2% from yesterday"
            color="blue.500"
          />
          <StatCard
            title="Water Reserves"
            value={72}
            unit="%"
            icon={FiDroplet}
            description="Main reservoir levels"
            color="cyan.500"
          />
        </SimpleGrid>
        
        <Tabs colorScheme="purple" size="lg" variant="enclosed" mb={6} onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab>System Status</Tab>
            <Tab>Alerts</Tab>
            <Tab>User Statistics</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel p={0} pt={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg">
                  <CardBody>
                    <Heading size="md" mb={4}>System Health</Heading>
                    
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Database Performance</Text>
                          <Text fontWeight="bold">92%</Text>
                        </Flex>
                        <Progress value={92} colorScheme="green" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>API Response Time</Text>
                          <Text fontWeight="bold">85%</Text>
                        </Flex>
                        <Progress value={85} colorScheme="green" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Server Load</Text>
                          <Text fontWeight="bold">68%</Text>
                        </Flex>
                        <Progress value={68} colorScheme="yellow" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Memory Usage</Text>
                          <Text fontWeight="bold">74%</Text>
                        </Flex>
                        <Progress value={74} colorScheme="yellow" borderRadius="md" />
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg">
                  <CardBody>
                    <Heading size="md" mb={4}>System Logs</Heading>
                    
                    <VStack spacing={4} align="stretch">
                      <ActivityItem 
                        title="Database Backup"
                        description="Automatic backup completed successfully"
                        time="10 minutes ago"
                        type="success"
                      />
                      <ActivityItem 
                        title="API Error"
                        description="Weather data fetch failed for Bangalore"
                        time="1 hour ago"
                        type="alert"
                      />
                      <ActivityItem 
                        title="Security Scan"
                        description="Weekly security scan complete - No issues found"
                        time="3 hours ago"
                        type="info"
                      />
                      <ActivityItem 
                        title="System Update"
                        description="Scheduled maintenance applied to all servers"
                        time="Yesterday"
                        type="info"
                      />
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel p={0} pt={4}>
              <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg">
                <CardBody>
                  <Heading size="md" mb={4}>Critical Alerts</Heading>
                  
                  <VStack spacing={4} align="stretch">
                    <AlertItem
                      title="Database Connection Issue"
                      description="Intermittent connection failures to the primary database."
                      severity="high"
                      time="Started 30 minutes ago"
                      city="System-wide"
                    />
                    <AlertItem
                      title="Traffic Emergency"
                      description="Multiple vehicle collision on Highway 66, emergency services dispatched."
                      severity="high"
                      time="Started 45 minutes ago"
                      city="Mumbai"
                    />
                    <AlertItem
                      title="Air Quality Critical"
                      description="PM2.5 levels exceeding safety thresholds in downtown area."
                      severity="high"
                      time="Started 2 hours ago"
                      city="Delhi"
                    />
                    <AlertItem
                      title="Water Treatment Facility Alert"
                      description="Abnormal pH levels detected in water treatment plant #3."
                      severity="medium"
                      time="Started 3 hours ago"
                      city="Chennai"
                    />
                  </VStack>
                  
                  <Button 
                    colorScheme="purple" 
                    variant="outline" 
                    mt={4} 
                    width="full"
                    as={Link}
                    to="/alerts"
                  >
                    View All Alerts
                  </Button>
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel p={0} pt={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg">
                  <CardBody>
                    <Heading size="md" mb={4}>User Statistics</Heading>
                    
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Mumbai</Text>
                          <Text fontWeight="bold">4,237 users</Text>
                        </Flex>
                        <Progress value={85} colorScheme="purple" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Delhi</Text>
                          <Text fontWeight="bold">3,891 users</Text>
                        </Flex>
                        <Progress value={78} colorScheme="purple" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Bangalore</Text>
                          <Text fontWeight="bold">2,582 users</Text>
                        </Flex>
                        <Progress value={52} colorScheme="purple" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Chennai</Text>
                          <Text fontWeight="bold">1,779 users</Text>
                        </Flex>
                        <Progress value={36} colorScheme="purple" borderRadius="md" />
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg">
                  <CardBody>
                    <Heading size="md" mb={4}>User Activity</Heading>
                    
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Active Sessions</Text>
                          <Text fontWeight="bold">1,247</Text>
                        </Flex>
                        <Progress value={62} colorScheme="blue" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>New Registrations (Weekly)</Text>
                          <Text fontWeight="bold">342</Text>
                        </Flex>
                        <Progress value={68} colorScheme="green" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Mobile Users</Text>
                          <Text fontWeight="bold">73%</Text>
                        </Flex>
                        <Progress value={73} colorScheme="orange" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Desktop Users</Text>
                          <Text fontWeight="bold">27%</Text>
                        </Flex>
                        <Progress value={27} colorScheme="purple" borderRadius="md" />
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <HStack spacing={4} mb={6}>
          <Button 
            leftIcon={<FiMap />} 
            colorScheme="purple" 
            variant="solid" 
            size="lg" 
            flex="1"
            as={Link}
            to="/city-map"
          >
            View All Cities
          </Button>
          <Button 
            leftIcon={<FiAlertCircle />} 
            colorScheme="red" 
            variant="outline" 
            size="lg" 
            flex="1"
            as={Link}
            to="/alerts"
          >
            Manage Alerts
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

// Activity Item Component
const ActivityItem = ({ title, description, time, type }: {
  title: string;
  description: string;
  time: string;
  type: 'info' | 'alert' | 'success';
}) => {
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'alert': return 'red.500';
      case 'success': return 'green.500';
      default: return 'blue.500';
    }
  };
  
  const color = getTypeColor(type);
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <Flex borderLeft="4px solid" borderColor={color} pl={3} py={1}>
      <Box>
        <Text fontWeight="bold">{title}</Text>
        <Text fontSize="sm">{description}</Text>
        <Text fontSize="xs" color={subtitleColor} mt={1}>{time}</Text>
      </Box>
    </Flex>
  );
};

// Alert Item Component
const AlertItem = ({ title, description, severity, time, city }: {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  time: string;
  city: string;
}) => {
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      default: return 'gray';
    }
  };
  
  const color = getSeverityColor(severity);
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box borderWidth="1px" borderRadius="md" p={3} borderColor={borderColor}>
      <Flex justify="space-between" mb={2}>
        <Text fontWeight="bold">{title}</Text>
        <HStack>
          <Badge>{city}</Badge>
          <Badge colorScheme={color}>{severity}</Badge>
        </HStack>
      </Flex>
      <Text fontSize="sm">{description}</Text>
      <Text fontSize="xs" color={subtitleColor} mt={2}>{time}</Text>
    </Box>
  );
};

export default AdminDashboard; 