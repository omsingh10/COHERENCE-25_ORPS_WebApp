import React, { useState } from 'react';
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
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FiHome, FiUsers, FiAlertCircle, FiSettings, FiBarChart2, FiMapPin, FiShield } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Sidebar menu item
const SidebarItem = ({ icon, children, isActive = false }: { icon: React.ReactElement, children: React.ReactNode, isActive?: boolean }) => {
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.700', 'blue.200');
  const inactiveColor = useColorModeValue('gray.700', 'gray.200');
  
  return (
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
        <Text fontSize="2xl" fontWeight="bold" color="purple.500">
          SmartCity
          <Badge ml={2} colorScheme="purple">Admin</Badge>
        </Text>
      </Flex>
      <VStack spacing={1} align="stretch" mt={5}>
        <SidebarItem icon={<FiHome size={18} />} isActive>Admin Dashboard</SidebarItem>
        <SidebarItem icon={<FiUsers size={18} />}>User Management</SidebarItem>
        <SidebarItem icon={<FiAlertCircle size={18} />}>Alert Management</SidebarItem>
        <SidebarItem icon={<FiBarChart2 size={18} />}>System Analytics</SidebarItem>
        <SidebarItem icon={<FiMapPin size={18} />}>City Configuration</SidebarItem>
        <SidebarItem icon={<FiShield size={18} />}>Security</SidebarItem>
        <SidebarItem icon={<FiSettings size={18} />}>Settings</SidebarItem>
      </VStack>
    </Box>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [alertType, setAlertType] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('medium');
  const [alertMessage, setAlertMessage] = useState('');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  // Mock data
  const cities = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'];
  
  // System stats
  const systemStats = [
    { name: 'Total Users', value: 245, change: 12.8, icon: '👥' },
    { name: 'Active Sensors', value: 1289, change: 4.3, icon: '📡' },
    { name: 'Alerts Today', value: 18, change: -8.4, icon: '🔔' },
    { name: 'System Uptime', value: 99.97, unit: '%', change: 0.2, icon: '⏱️' },
  ];
  
  // Alerts data
  const alerts = [
    { id: 1, city: 'Mumbai', type: 'Air Quality', severity: 'high', message: 'AQI above 150 - unhealthy levels detected', timestamp: '2025-03-28T09:15:00' },
    { id: 2, city: 'Delhi', type: 'Traffic', severity: 'medium', message: 'Major congestion on highway NH1', timestamp: '2025-03-28T10:23:00' },
    { id: 3, city: 'Bangalore', type: 'Water', severity: 'low', message: 'Reservoir levels dropping slowly', timestamp: '2025-03-28T11:05:00' },
    { id: 4, city: 'Chennai', type: 'Energy', severity: 'high', message: 'Unusually high energy consumption in sector 7', timestamp: '2025-03-28T08:45:00' },
    { id: 5, city: 'Hyderabad', type: 'Air Quality', severity: 'medium', message: 'AQI rising in industrial zone', timestamp: '2025-03-28T07:30:00' },
  ];
  
  // User data
  const users = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', city: 'Mumbai', role: 'user', lastLogin: '2025-03-28T09:15:00' },
    { id: 2, name: 'Priya Singh', email: 'priya@example.com', city: 'Delhi', role: 'user', lastLogin: '2025-03-28T10:23:00' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', city: 'All Cities', role: 'admin', lastLogin: '2025-03-28T11:05:00' },
    { id: 4, name: 'Amit Patel', email: 'amit@example.com', city: 'Chennai', role: 'user', lastLogin: '2025-03-28T08:45:00' },
    { id: 5, name: 'Neha Gupta', email: 'neha@example.com', city: 'Bangalore', role: 'user', lastLogin: '2025-03-28T07:30:00' },
  ];
  
  // Chart data
  const usersByCity = {
    labels: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Other'],
    datasets: [
      {
        label: 'Users',
        data: [65, 59, 80, 81, 56, 23],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  
  const alertsByType = {
    labels: ['Air Quality', 'Traffic', 'Water', 'Energy', 'Other'],
    datasets: [
      {
        label: 'Alerts (Last 30 days)',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      },
    ],
  };
  
  // Component for statistical card
  const StatCard = ({ title, value, unit, change, icon }: { title: string, value: number, unit?: string, change: number, icon?: string }) => {
    const cardBg = useColorModeValue('white', 'gray.700');
    const iconBg = useColorModeValue('purple.50', 'purple.900');
    
    return (
      <Card bg={cardBg} boxShadow="sm" borderRadius="lg">
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
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {title}
              </Text>
              <Stat>
                <StatNumber fontSize="2xl" fontWeight="bold" color="purple.600">
                  {value}{unit && <Text as="span" fontSize="lg">{unit}</Text>}
                </StatNumber>
                <StatHelpText m={0}>
                  <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(change)}% from previous period
                </StatHelpText>
              </Stat>
            </Box>
          </Flex>
        </CardBody>
      </Card>
    );
  };
  
  // Chart Card component
  const ChartCard = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const cardBg = useColorModeValue('white', 'gray.700');
    
    return (
      <Card bg={cardBg} boxShadow="sm" borderRadius="lg">
        <CardHeader>
          <Heading size="md">{title}</Heading>
        </CardHeader>
        <CardBody>
          <Box height="300px">
            {children}
          </Box>
        </CardBody>
      </Card>
    );
  }
  
  // Severity badge
  const SeverityBadge = ({ severity }: { severity: string }) => {
    let color;
    switch (severity) {
      case 'high':
        color = 'red';
        break;
      case 'medium':
        color = 'orange';
        break;
      case 'low':
        color = 'yellow';
        break;
      default:
        color = 'gray';
    }
    
    return <Badge colorScheme={color}>{severity}</Badge>;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Handle creating alert
  const handleCreateAlert = () => {
    // In a real app, this would call an API endpoint
    console.log('Creating alert:', { 
      city: selectedCity, 
      type: alertType, 
      severity: alertSeverity, 
      message: alertMessage 
    });
    
    // Reset form and close modal
    setAlertType('');
    setAlertSeverity('medium');
    setAlertMessage('');
    onClose();
    
    // Show success notification (in a real app)
  };
  
  return (
    <Flex>
      {/* Sidebar - hidden on mobile */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Sidebar />
      </Box>
      
      {/* Main content area */}
      <Box
        ml={{ base: 0, md: 60 }}
        p="4"
        width="full"
        bg={bgColor}
        minH="100vh"
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading as="h1" size="lg">Admin Dashboard</Heading>
            <Text color="gray.600">Welcome back, {user?.name || 'Admin'}</Text>
          </Box>
          
          <Flex>
            <Select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)} 
              maxW="200px"
              mr={4}
              bg="white"
              borderRadius="lg"
            >
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Select>
            
            <Button 
              leftIcon={<AddIcon />} 
              colorScheme="purple" 
              onClick={onOpen}
              borderRadius="lg"
            >
              Create Alert
            </Button>
          </Flex>
        </Flex>
        
        {/* System Stats */}
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5} mb={6}>
          {systemStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.name}
              value={stat.value}
              unit={stat.unit}
              change={stat.change}
              icon={stat.icon}
            />
          ))}
        </SimpleGrid>
        
        {/* Tabs */}
        <Tabs colorScheme="purple" mb={6} variant="enclosed">
          <TabList>
            <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>Alerts</Tab>
            <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>Users</Tab>
            <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>Analytics</Tab>
          </TabList>
          
          <TabPanels>
            {/* Alerts Tab */}
            <TabPanel p={0} pt={4}>
              <Card borderRadius="lg">
                <CardHeader bg="white">
                  <Heading size="md">Active Alerts</Heading>
                </CardHeader>
                <CardBody overflowX="auto" bg="white" p={0}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>City</Th>
                        <Th>Type</Th>
                        <Th>Severity</Th>
                        <Th>Message</Th>
                        <Th>Timestamp</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {alerts.map((alert) => (
                        <Tr key={alert.id}>
                          <Td>{alert.id}</Td>
                          <Td>{alert.city}</Td>
                          <Td>{alert.type}</Td>
                          <Td><SeverityBadge severity={alert.severity} /></Td>
                          <Td>{alert.message}</Td>
                          <Td>{formatDate(alert.timestamp)}</Td>
                          <Td>
                            <IconButton
                              aria-label="Edit"
                              icon={<EditIcon />}
                              size="sm"
                              mr={2}
                              variant="ghost"
                            />
                            <IconButton
                              aria-label="Delete"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Users Tab */}
            <TabPanel p={0} pt={4}>
              <Card borderRadius="lg">
                <CardHeader bg="white">
                  <Heading size="md">User Management</Heading>
                </CardHeader>
                <CardBody overflowX="auto" bg="white" p={0}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>City</Th>
                        <Th>Role</Th>
                        <Th>Last Login</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((user) => (
                        <Tr key={user.id}>
                          <Td>{user.id}</Td>
                          <Td>{user.name}</Td>
                          <Td>{user.email}</Td>
                          <Td>{user.city}</Td>
                          <Td>
                            <Badge colorScheme={user.role === 'admin' ? 'purple' : 'green'}>
                              {user.role}
                            </Badge>
                          </Td>
                          <Td>{formatDate(user.lastLogin)}</Td>
                          <Td>
                            <IconButton
                              aria-label="Edit"
                              icon={<EditIcon />}
                              size="sm"
                              mr={2}
                              variant="ghost"
                            />
                            <IconButton
                              aria-label="Delete"
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </TabPanel>
            
            {/* Analytics Tab */}
            <TabPanel p={0} pt={4}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <ChartCard title="Users by City">
                  <Bar 
                    data={usersByCity} 
                    options={{ 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                    }} 
                  />
                </ChartCard>
                
                <ChartCard title="Alerts by Type">
                  <Bar 
                    data={alertsByType} 
                    options={{ 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                    }} 
                  />
                </ChartCard>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        {/* Create Alert Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent borderRadius="lg">
            <ModalHeader>Create New Alert</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>City</FormLabel>
                <Select value={selectedCity}>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl mb={4}>
                <FormLabel>Alert Type</FormLabel>
                <Select 
                  placeholder="Select alert type"
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                >
                  <option value="Air Quality">Air Quality</option>
                  <option value="Traffic">Traffic</option>
                  <option value="Water">Water</option>
                  <option value="Energy">Energy</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>
              
              <FormControl mb={4}>
                <FormLabel>Severity</FormLabel>
                <Select
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value)}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </FormControl>
              
              <FormControl mb={4}>
                <FormLabel>Alert Message</FormLabel>
                <Textarea
                  placeholder="Enter alert message"
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                />
              </FormControl>
            </ModalBody>
            
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="purple" onClick={handleCreateAlert}>
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