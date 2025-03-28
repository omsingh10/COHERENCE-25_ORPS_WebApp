import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Flex,
  Heading,
  Select,
  Container,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Badge,
  Button,
  VStack,
  HStack,
  Divider,
  Grid,
  GridItem,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Image,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
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
} from 'chart.js';
import { FiHome, FiPieChart, FiMap, FiAlertCircle, FiSettings, FiBarChart2, FiFileText, FiUpload } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// India Energy API configuration
const ENERGY_API_KEY = "6P1fGUphniT5LQFPMsQq";
const ENERGY_API_ENDPOINT = "https://api.electricitymap.org/v3/carbon-intensity/latest?zone=IN-NE";

// Dummy data for charts
const getChartData = (label: string, color: string) => {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label,
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true,
        tension: 0.4,
      },
    ],
  };
};

// Mock alert data
const mockAlerts = {
  'Mumbai': [
    { id: 1, type: 'Air Quality', message: 'AQI rising in Andheri region', severity: 'medium', timestamp: new Date().toISOString() },
    { id: 2, type: 'Traffic', message: 'Heavy congestion on Western Express Highway', severity: 'high', timestamp: new Date(Date.now() - 3600000).toISOString() },
  ],
  'Delhi': [
    { id: 3, type: 'Air Quality', message: 'Hazardous AQI levels detected in Central Delhi', severity: 'high', timestamp: new Date().toISOString() },
    { id: 4, type: 'Water', message: 'Low water pressure in South Delhi', severity: 'medium', timestamp: new Date(Date.now() - 7200000).toISOString() },
  ],
  'Bangalore': [
    { id: 5, type: 'Traffic', message: 'Slow traffic on Outer Ring Road', severity: 'medium', timestamp: new Date().toISOString() },
  ],
  'Chennai': [
    { id: 6, type: 'Water', message: 'Water reservoir levels below 30%', severity: 'high', timestamp: new Date().toISOString() },
  ],
  'Hyderabad': [
    { id: 7, type: 'Energy', message: 'Power fluctuations in Hi-Tech City area', severity: 'low', timestamp: new Date().toISOString() },
  ],
};

// Mock stats data by city
const cityStats = {
  'Mumbai': [
    { title: 'Air Quality Index', value: 72, change: 5.3, color: 'orange.500', icon: '🌫️' },
    { title: 'Traffic Density', value: 425, unit: ' cars/h', change: -2.1, color: 'red.500', icon: '🚗' },
    { title: 'Water Level', value: 68, unit: '%', change: 8.4, color: 'blue.500', icon: '💧' },
    { title: 'Energy Usage', value: 156, unit: ' kWh', change: -12.3, color: 'green.500', icon: '⚡' },
  ],
  'Delhi': [
    { title: 'Air Quality Index', value: 156, change: 12.7, color: 'red.500', icon: '🌫️' },
    { title: 'Traffic Density', value: 512, unit: ' cars/h', change: 3.1, color: 'orange.500', icon: '🚗' },
    { title: 'Water Level', value: 45, unit: '%', change: -5.4, color: 'orange.500', icon: '💧' },
    { title: 'Energy Usage', value: 189, unit: ' kWh', change: 8.3, color: 'yellow.500', icon: '⚡' },
  ],
  'Bangalore': [
    { title: 'Air Quality Index', value: 63, change: -8.3, color: 'green.500', icon: '🌫️' },
    { title: 'Traffic Density', value: 481, unit: ' cars/h', change: 7.1, color: 'red.500', icon: '🚗' },
    { title: 'Water Level', value: 72, unit: '%', change: 2.4, color: 'blue.500', icon: '💧' },
    { title: 'Energy Usage', value: 142, unit: ' kWh', change: -5.3, color: 'green.500', icon: '⚡' },
  ],
  'Chennai': [
    { title: 'Air Quality Index', value: 58, change: -3.3, color: 'green.500', icon: '🌫️' },
    { title: 'Traffic Density', value: 352, unit: ' cars/h', change: -5.1, color: 'green.500', icon: '🚗' },
    { title: 'Water Level', value: 28, unit: '%', change: -12.4, color: 'red.500', icon: '💧' },
    { title: 'Energy Usage', value: 168, unit: ' kWh', change: 2.3, color: 'yellow.500', icon: '⚡' },
  ],
  'Hyderabad': [
    { title: 'Air Quality Index', value: 67, change: 2.3, color: 'yellow.500', icon: '🌫️' },
    { title: 'Traffic Density', value: 395, unit: ' cars/h', change: -1.1, color: 'green.500', icon: '🚗' },
    { title: 'Water Level', value: 62, unit: '%', change: 3.4, color: 'blue.500', icon: '💧' },
    { title: 'Energy Usage', value: 152, unit: ' kWh', change: -3.3, color: 'green.500', icon: '⚡' },
  ],
};

// Component for statistical card
interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  change: number;
  color: string;
  icon?: string;
}

const StatCard = ({ title, value, unit, change, color, icon }: StatCardProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const iconBg = useColorModeValue(`${color}20`, `${color}30`);
  
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
              bg={iconBg}
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
                {value}{unit && <Text as="span" fontSize="lg">{unit}</Text>}
              </StatNumber>
              <StatHelpText m={0}>
                <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(change)}% from yesterday
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

// Charts
const ChartCard = ({ title, data, height = '250px' }: { title: string, data: any, height?: string }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  
  return (
    <Card bg={bgColor} boxShadow="sm" borderRadius="lg">
      <CardHeader>
        <Heading size="md">{title}</Heading>
      </CardHeader>
      <CardBody>
        <Box height={height}>
          <Line 
            data={data} 
            options={{ 
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
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
  );
};

// Alert component
const AlertCard = ({ alerts }: { alerts: any[] }) => {
  const [visibleAlerts, setVisibleAlerts] = useState(alerts);
  
  const removeAlert = (id: number) => {
    setVisibleAlerts(visibleAlerts.filter(alert => alert.id !== id));
  };
  
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      default: return 'gray';
    }
  };
  
  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.round(diffMs / 60000);
    
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hr ago`;
    
    return date.toLocaleDateString();
  };
  
  if (visibleAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <Heading size="md">City Alerts</Heading>
        </CardHeader>
        <CardBody>
          <Text color="gray.500">No active alerts for this city</Text>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <Heading size="md">City Alerts</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          {visibleAlerts.map((alert) => (
            <Alert key={alert.id} status={getSeverityColor(alert.severity) as any} variant="left-accent" borderRadius="md">
              <Box flex="1">
                <HStack mb={1}>
                  <AlertTitle>{alert.type}</AlertTitle>
                  <Badge colorScheme={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  <Text fontSize="xs" color="gray.500" ml="auto">{formatTimeAgo(alert.timestamp)}</Text>
                </HStack>
                <AlertDescription display="block">
                  {alert.message}
                </AlertDescription>
              </Box>
              <CloseButton position="absolute" right="8px" top="8px" onClick={() => removeAlert(alert.id)} />
            </Alert>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};

// Sidebar menu item - Fixed to use React Router Link correctly
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
        <SidebarItem icon={<FiHome size={18} />} to="/user-dashboard" isActive>Dashboard</SidebarItem>
        <SidebarItem icon={<FiPieChart size={18} />} to="/analytics">Analytics</SidebarItem>
        <SidebarItem icon={<FiMap size={18} />} to="/city-map">City Map</SidebarItem>
        <SidebarItem icon={<FiAlertCircle size={18} />} to="/alerts">Alerts</SidebarItem>
        <SidebarItem icon={<FiFileText size={18} />} to="/reports">Reports</SidebarItem>
        <SidebarItem icon={<FiSettings size={18} />} to="/settings">Settings</SidebarItem>
      </VStack>
    </Box>
  );
};

// Map Component
const CityMap = () => {
  return (
    <Card borderRadius="lg" overflow="hidden" boxShadow="sm" height="400px">
      <CardHeader>
        <Heading size="md">City Map</Heading>
      </CardHeader>
      <CardBody p={0}>
        <Box
          as="iframe"
          src="https://www.openstreetmap.org/export/embed.html?bbox=72.7,18.8,73.1,19.2&layer=mapnik"
          width="100%"
          height="100%"
          borderWidth="0"
        />
      </CardBody>
    </Card>
  );
};

// Report Issue Form with image upload
const ReportForm = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const toast = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would upload the image and form data to your server
    toast({
      title: "Report submitted",
      description: "Your issue report has been successfully submitted.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    
    // Reset form (would be more thorough in a real app)
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <Card borderRadius="lg" boxShadow="sm">
      <CardHeader>
        <Heading size="md">Report an Issue</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <HStack spacing={4} width="full">
              <FormControl>
                <FormLabel>Issue Category</FormLabel>
                <Select placeholder="Select a category" required>
                  <option value="air">Air Quality</option>
                  <option value="water">Water Supply</option>
                  <option value="traffic">Traffic</option>
                  <option value="power">Power Outage</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Issue Priority</FormLabel>
                <Select placeholder="Select a priority" required>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input placeholder="Enter the location of the issue..." required />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="Describe the issue in detail..." rows={3} required />
            </FormControl>
            
            {/* Image Upload Section */}
            <FormControl>
              <FormLabel>Upload Image (Optional)</FormLabel>
              <Flex 
                direction="column" 
                borderWidth={2} 
                borderRadius="md" 
                borderStyle="dashed" 
                borderColor="gray.300"
                p={4}
                align="center"
                justify="center"
                cursor="pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
                {imagePreview ? (
                  <VStack spacing={2}>
                    <Image 
                      src={imagePreview} 
                      alt="Preview" 
                      maxHeight="150px" 
                      borderRadius="md"
                    />
                    <Text fontSize="sm" color="gray.500">
                      {selectedImage?.name}
                    </Text>
                    <Button 
                      size="xs" 
                      colorScheme="red" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove
                    </Button>
                  </VStack>
                ) : (
                  <VStack spacing={2}>
                    <FiUpload size={24} color="gray" />
                    <Text fontSize="sm" color="gray.500">Click to upload an image</Text>
                    <Text fontSize="xs" color="gray.400">
                      Supported formats: JPEG, PNG, GIF
                    </Text>
                  </VStack>
                )}
              </Flex>
            </FormControl>
            
            <HStack spacing={4} width="full">
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Your name..." required />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Your email address..." type="email" required />
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input placeholder="Your phone number..." />
            </FormControl>
            <Button colorScheme="blue" alignSelf="flex-end" type="submit">
              Submit Report
            </Button>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState(user?.city || 'Mumbai');
  const [stats, setStats] = useState(cityStats[selectedCity as keyof typeof cityStats]);
  const [alerts, setAlerts] = useState(mockAlerts[selectedCity as keyof typeof mockAlerts] || []);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Update data when city changes
  useEffect(() => {
    setStats(cityStats[selectedCity as keyof typeof cityStats]);
    setAlerts(mockAlerts[selectedCity as keyof typeof mockAlerts] || []);
  }, [selectedCity]);
  
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
            <Heading as="h1" size="lg">CitySync</Heading>
            <Text color="gray.600">City Dashboard</Text>
          </Box>
          
          <Select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)} 
            maxW="200px"
            isDisabled={!!user?.city} // Disable selection if user has assigned city
            bg="white"
            borderRadius="lg"
          >
            {Object.keys(cityStats).map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </Select>
        </Flex>
        
        {/* City summary banner */}
        {user?.city && (
          <Alert status="info" mb={6} borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>Your assigned city:</AlertTitle>
            <AlertDescription>
              You are viewing data for {user.city}. As a city-specific user, you can only see information for this location.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5} mb={6}>
          {stats.map((stat, index) => (
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
        
        {/* India Energy Card */}
        <Box mb={6}>
          <IndiaEnergyCard />
        </Box>
        
        {/* Charts */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
          <ChartCard 
            title="Air Quality Monitoring" 
            data={getChartData('AQI', '#ED8936')} 
            height="270px"
          />
          <ChartCard 
            title="Traffic Analysis" 
            data={getChartData('Vehicles per hour', '#E53E3E')} 
            height="270px"
          />
        </SimpleGrid>
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
          <ChartCard 
            title="Water Reservoir Levels" 
            data={getChartData('Percentage', '#3182CE')} 
            height="270px"
          />
          <ChartCard 
            title="Energy Consumption" 
            data={getChartData('kWh', '#38A169')} 
            height="270px"
          />
        </SimpleGrid>
        
        {/* Map and Alerts Section */}
        <SimpleGrid columns={{ base: 1, lg: 1 }} spacing={6} mb={6}>
          <CityMap />
        </SimpleGrid>
        
        {/* Report Form */}
        <Box mb={6}>
          <ReportForm />
        </Box>
      </Box>
    </Flex>
  );
};

export default Dashboard; 