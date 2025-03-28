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
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { FiPlus, FiUser, FiUsers, FiAlertCircle, FiBarChart2, FiMap, FiSettings, FiLock, FiFileText } from 'react-icons/fi';
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

// Sidebar menu item using proper React Router Link
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
        <SidebarItem icon={<FiBarChart2 size={18} />} to="/admin" isActive>Admin Dashboard</SidebarItem>
        <SidebarItem icon={<FiUsers size={18} />} to="/users">User Management</SidebarItem>
        <SidebarItem icon={<FiAlertCircle size={18} />} to="/alerts">Alert Management</SidebarItem>
        <SidebarItem icon={<FiMap size={18} />} to="/city-map">City Map</SidebarItem>
        <SidebarItem icon={<FiBarChart2 size={18} />} to="/analytics">System Analytics</SidebarItem>
        <SidebarItem icon={<FiFileText size={18} />} to="/reports">Reports</SidebarItem>
        <SidebarItem icon={<FiSettings size={18} />} to="/settings">Settings</SidebarItem>
        <SidebarItem icon={<FiLock size={18} />} to="/security">Security</SidebarItem>
      </VStack>
    </Box>
  );
};

const AdminDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  
  const cardBg = useColorModeValue('white', 'gray.700');
  
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
        
        {/* India Energy API Card */}
        <Box mb={6}>
          <IndiaEnergyCard />
        </Box>
        
        {/* Charts */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Users by City</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px">
                <Bar 
                  data={usersByCity} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }} 
                />
              </Box>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Alerts by Type</Heading>
            </CardHeader>
            <CardBody>
              <Box height="300px" display="flex" justifyContent="center">
                <Box maxW="250px">
                  <Doughnut 
                    data={alertsByType} 
                    options={{ 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right' as const,
                        },
                      },
                    }} 
                  />
                </Box>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        {/* Tables - Recent Alerts and Users */}
        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6} mb={6}>
          <Card bg={cardBg}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Recent Alerts</Heading>
                <Link to="/alerts">
                  <Button size="sm" colorScheme="blue" variant="ghost">
                    View All
                  </Button>
                </Link>
              </Flex>
            </CardHeader>
            <CardBody>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>City</Th>
                    <Th>Type</Th>
                    <Th>Severity</Th>
                    <Th>Time</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentAlerts.map((alert) => (
                    <Tr key={alert.id}>
                      <Td>{alert.city}</Td>
                      <Td>{alert.type}</Td>
                      <Td>
                        <Badge colorScheme={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </Td>
                      <Td>{alert.time}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
          
          <Card bg={cardBg}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Recent Users</Heading>
                <Link to="/users">
                  <Button size="sm" colorScheme="blue" variant="ghost">
                    View All
                  </Button>
                </Link>
              </Flex>
            </CardHeader>
            <CardBody>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>City</Th>
                    <Th>Role</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentUsers.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.name}</Td>
                      <Td>{user.city}</Td>
                      <Td>{user.role}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </SimpleGrid>
        
        {/* Create Alert Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Alert</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl id="city" isRequired>
                  <FormLabel>City</FormLabel>
                  <Select placeholder="Select city">
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl id="alertType" isRequired>
                  <FormLabel>Alert Type</FormLabel>
                  <Select placeholder="Select alert type">
                    <option value="air">Air Quality</option>
                    <option value="traffic">Traffic</option>
                    <option value="water">Water</option>
                    <option value="power">Power</option>
                    <option value="security">Security</option>
                  </Select>
                </FormControl>
                
                <FormControl id="severity" isRequired>
                  <FormLabel>Severity</FormLabel>
                  <Select placeholder="Select severity">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </FormControl>
                
                <FormControl id="message" isRequired>
                  <FormLabel>Alert Message</FormLabel>
                  <Textarea placeholder="Enter detailed alert message..." />
                </FormControl>
              </Stack>
            </ModalBody>
            
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue">
                Create Alert
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default AdminDashboard; 