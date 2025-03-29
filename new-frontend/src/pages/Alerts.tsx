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
  VStack,
  HStack,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Image,
  Spinner,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { FiHome, FiPieChart, FiMap, FiAlertCircle, FiSettings, FiPlus, FiFilter, FiRefreshCw, FiMoreVertical, FiTrash2, FiEdit, FiUpload, FiFile, FiFileText, FiInfo, FiCheckCircle, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

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
            <SidebarItem icon={<FiAlertCircle size={18} />} to="/alerts" isActive>Alert Management</SidebarItem>
            <SidebarItem icon={<FiMap size={18} />} to="/city-map">City Map</SidebarItem>
            <SidebarItem icon={<FiPieChart size={18} />} to="/analytics">System Analytics</SidebarItem>
            <SidebarItem icon={<FiFileText size={18} />} to="/reports">Reports</SidebarItem>
            <SidebarItem icon={<FiSettings size={18} />} to="/settings">Settings</SidebarItem>
          </>
        ) : (
          // User sidebar items
          <>
            <SidebarItem icon={<FiHome size={18} />} to="/user-dashboard">Dashboard</SidebarItem>
            <SidebarItem icon={<FiPieChart size={18} />} to="/analytics">Analytics</SidebarItem>
            <SidebarItem icon={<FiMap size={18} />} to="/city-map">City Map</SidebarItem>
            <SidebarItem icon={<FiAlertCircle size={18} />} to="/alerts" isActive>Alerts</SidebarItem>
            <SidebarItem icon={<FiFileText size={18} />} to="/reports">Reports</SidebarItem>
            <SidebarItem icon={<FiSettings size={18} />} to="/settings">Settings</SidebarItem>
          </>
        )}
      </VStack>
    </Box>
  );
};

// Alert component with action buttons
interface CityAlertProps {
  id: number;
  title: string;
  message: string;
  severity: 'High' | 'Medium' | 'Low';
  location: string;
  time: string;
  onAcknowledge: (id: number) => void;
  onDismiss: (id: number) => void;
}

const CityAlert = ({ id, title, message, severity, location, time, onAcknowledge, onDismiss }: CityAlertProps) => {
  // Determine alert color based on severity
  const getAlertColor = (severity: string) => {
    switch(severity) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'yellow';
      default: return 'gray';
    }
  };
  
  const alertColor = getAlertColor(severity);
  
  return (
    <Alert status={alertColor as any} variant="solid" borderRadius="md" mb={4} p={0} overflow="hidden">
      <Box width="100%">
        <Flex p={4} alignItems="flex-start">
          <AlertIcon mt={1} />
          <Box flex="1">
            <Flex mb={2} justifyContent="space-between" alignItems="flex-start">
              <AlertTitle>{title}</AlertTitle>
              <Badge colorScheme={alertColor === 'red' ? 'red' : (alertColor === 'orange' ? 'orange' : 'yellow')}>{severity} Severity</Badge>
            </Flex>
            <AlertDescription display="block">
              {message}
            </AlertDescription>
            <HStack mt={2} fontSize="sm" color="white" opacity={0.8}>
              <Text>• {time}</Text>
              <Text>• {location}</Text>
            </HStack>
          </Box>
        </Flex>
        <Divider />
        <Flex>
          <Button 
            flex="1" 
            colorScheme={alertColor} 
            variant="ghost" 
            borderRadius="0" 
            py={2}
            leftIcon={<Box>✓</Box>}
            onClick={() => onAcknowledge(id)}
          >
            Acknowledge
          </Button>
          <Divider orientation="vertical" />
          <Button 
            flex="1" 
            colorScheme={alertColor} 
            variant="ghost" 
            borderRadius="0" 
            py={2}
            leftIcon={<Box>×</Box>}
            onClick={() => onDismiss(id)}
          >
            Dismiss
          </Button>
        </Flex>
      </Box>
    </Alert>
  );
};

// Mock data for alerts
const initialAlerts = [
  {
    id: 1,
    city: 'Mumbai',
    type: 'Air Quality',
    severity: 'high',
    message: 'Dangerous AQI levels detected in Andheri West area. Air quality index has reached 315, which is in the "Very Unhealthy" range. Citizens are advised to wear masks and avoid outdoor activities.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'active',
    image: 'https://images.unsplash.com/photo-1575423204492-4fa900150180?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    city: 'Delhi',
    type: 'Traffic',
    severity: 'medium',
    message: 'Heavy traffic congestion on Delhi-Gurgaon expressway due to ongoing construction. Expected delays of 25-30 minutes. Consider alternative routes.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'active',
    image: null
  },
  {
    id: 3,
    city: 'Bangalore',
    type: 'Water',
    severity: 'high',
    message: 'Water supply interruption in Koramangala and HSR Layout. Maintenance work in progress. Expected to resume by 6 PM.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'resolved',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777c63?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    city: 'Chennai',
    type: 'Power',
    severity: 'medium',
    message: 'Scheduled power outage in Adyar and Besant Nagar from 10 AM to 2 PM for maintenance work.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'active',
    image: null
  },
  {
    id: 5,
    city: 'Hyderabad',
    type: 'Infrastructure',
    severity: 'low',
    message: 'Road repair work on NH 44 may cause slight delays. Work scheduled during night hours to minimize disruption.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

// Alert types with their corresponding colors
const alertTypes = {
  'Air Quality': 'purple',
  'Traffic': 'orange',
  'Water': 'blue',
  'Power': 'yellow',
  'Infrastructure': 'gray',
  'Waste': 'green',
  'Security': 'red',
  'Public Health': 'teal',
  'Other': 'gray'
};

// Cities list
const cities = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];

// Severity levels with colors
const severityColors = {
  high: 'red',
  medium: 'orange',
  low: 'yellow'
};

// Status badges with colors
const statusColors = {
  active: 'red',
  pending: 'yellow',
  resolved: 'green'
};

// Alert type definition
interface Alert {
  id: string;
  city: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

// Component for displaying a single alert
const AlertCard = ({ alert, onAcknowledge, onResolve }: { 
  alert: Alert; 
  onAcknowledge: (id: string) => void; 
  onResolve: (id: string) => void; 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  
  // Determine severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'orange';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };
  
  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="sm"
      position="relative"
    >
      <Flex justify="space-between" align="flex-start" mb={2}>
        <VStack align="start" spacing={1}>
          <Heading size="md">{alert.type}</Heading>
          <Text fontSize="sm" color={subtitleColor}>{alert.city} • {formatTime(alert.timestamp)}</Text>
        </VStack>
        <Badge colorScheme={getSeverityColor(alert.severity)} px={2} py={1} borderRadius="md">
          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
        </Badge>
      </Flex>
      
      <Text my={2}>{alert.message}</Text>
      <Text fontSize="sm" color={subtitleColor} mb={4}>Location: {alert.location}</Text>
      
      <Divider mb={3} />
      
      <Flex justify="space-between" align="center">
        <Badge 
          colorScheme={
            alert.status === 'new' ? 'blue' : 
            alert.status === 'acknowledged' ? 'purple' : 
            'green'
          }
        >
          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
        </Badge>
        
        <HStack>
          {alert.status === 'new' && (
            <Button 
              size="sm" 
              leftIcon={<FiInfo />} 
              colorScheme="blue" 
              variant="outline"
              onClick={() => onAcknowledge(alert.id)}
            >
              Acknowledge
            </Button>
          )}
          {(alert.status === 'new' || alert.status === 'acknowledged') && (
            <Button 
              size="sm" 
              leftIcon={<FiCheckCircle />} 
              colorScheme="green" 
              variant={alert.status === 'new' ? 'outline' : 'solid'}
              onClick={() => onResolve(alert.id)}
            >
              Resolve
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

const Alerts = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  // Color mode values
  const bg = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // State for alerts and filters
  const [selectedCity, setSelectedCity] = useState<string>(user?.city || 'all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState(0);
  
  // Mock data for alerts
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      city: 'Mumbai',
      type: 'Traffic Congestion',
      severity: 'high',
      message: 'Major traffic congestion on Western Express Highway due to an accident.',
      location: 'Western Express Highway, Andheri',
      timestamp: '2023-03-15T08:30:00',
      status: 'new'
    },
    {
      id: '2',
      city: 'Delhi',
      type: 'Air Quality',
      severity: 'critical',
      message: 'Hazardous air quality levels detected. AQI exceeding 300 in multiple areas.',
      location: 'Central Delhi',
      timestamp: '2023-03-15T10:15:00',
      status: 'acknowledged'
    },
    {
      id: '3',
      city: 'Bangalore',
      type: 'Power Outage',
      severity: 'medium',
      message: 'Scheduled power outage for maintenance work.',
      location: 'Koramangala, HSR Layout',
      timestamp: '2023-03-14T14:00:00',
      status: 'resolved'
    },
    {
      id: '4',
      city: 'Mumbai',
      type: 'Flooding',
      severity: 'high',
      message: 'Street flooding reported due to heavy rainfall. Avoid low-lying areas.',
      location: 'Dadar, Parel',
      timestamp: '2023-03-14T16:45:00',
      status: 'acknowledged'
    },
    {
      id: '5',
      city: 'Chennai',
      type: 'Water Supply',
      severity: 'medium',
      message: 'Water supply will be interrupted for 6 hours for pipeline maintenance.',
      location: 'T. Nagar, Mylapore',
      timestamp: '2023-03-15T09:00:00',
      status: 'new'
    },
    {
      id: '6',
      city: 'Hyderabad',
      type: 'Traffic Diversion',
      severity: 'low',
      message: 'Traffic diversion in place due to construction work.',
      location: 'Banjara Hills, Jubilee Hills',
      timestamp: '2023-03-15T11:30:00',
      status: 'new'
    }
  ]);
  
  // Form state for new alert
  const [newAlert, setNewAlert] = useState({
    city: user?.city || 'Mumbai',
    type: 'Traffic Congestion',
    severity: 'medium',
    message: '',
    location: ''
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAlert(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Create new alert
  const handleCreateAlert = () => {
    // Validation
    if (!newAlert.message || !newAlert.location) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }
    
    // Create new alert object
    const alert: Alert = {
      id: Date.now().toString(),
      ...newAlert,
      severity: newAlert.severity as 'low' | 'medium' | 'high' | 'critical',
      timestamp: new Date().toISOString(),
      status: 'new'
    };
    
    // Add to alerts list
    setAlerts(prev => [alert, ...prev]);
    
    // Reset form and close modal
    setNewAlert({
      city: user?.city || 'Mumbai',
      type: 'Traffic Congestion',
      severity: 'medium',
      message: '',
      location: ''
    });
    onClose();
    
    toast({
      title: 'Alert created',
      description: 'New alert has been created successfully',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  };
  
  // Handle alert acknowledgement
  const handleAcknowledge = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { ...alert, status: 'acknowledged' } 
          : alert
      )
    );
    
    toast({
      title: 'Alert acknowledged',
      description: 'The alert has been marked as acknowledged',
      status: 'info',
      duration: 3000,
      isClosable: true
    });
  };
  
  // Handle alert resolution
  const handleResolve = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { ...alert, status: 'resolved' } 
          : alert
      )
    );
    
    toast({
      title: 'Alert resolved',
      description: 'The alert has been marked as resolved',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  };
  
  // Filter alerts based on selected filters
  const filteredAlerts = alerts.filter(alert => {
    return (
      (selectedCity === 'all' || alert.city === selectedCity) &&
      (selectedSeverity === 'all' || alert.severity === selectedSeverity) &&
      (selectedType === 'all' || alert.type === selectedType) &&
      (selectedStatus === 'all' || alert.status === selectedStatus)
    );
  });
  
  // Group alerts by status for tabs
  const alertsByStatus = {
    all: filteredAlerts,
    new: filteredAlerts.filter(alert => alert.status === 'new'),
    acknowledged: filteredAlerts.filter(alert => alert.status === 'acknowledged'),
    resolved: filteredAlerts.filter(alert => alert.status === 'resolved')
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedCity('all');
    setSelectedSeverity('all');
    setSelectedType('all');
    setSelectedStatus('all');
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
            <Heading as="h1" size="lg">City Alerts</Heading>
            <Text color="gray.600">Monitoring and managing critical situations</Text>
          </Box>
          
          <HStack spacing={3}>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Create New Alert
            </Button>
            
            <Select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              maxW="150px"
              bg="white"
              borderRadius="lg"
            >
              <option value="all">All Alerts</option>
              <option value="new">New</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </Select>
          </HStack>
        </Flex>
        
        {/* City Selection */}
        {user?.role === 'admin' && (
          <Box mb={4}>
            <Select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              bg="white"
              borderRadius="lg"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Select>
          </Box>
        )}
        
        {/* Alerts List */}
        <Card borderRadius="lg" boxShadow="sm" bg={useColorModeValue('white', 'gray.700')} mb={6}>
          <CardBody p={6}>
            {alertsByStatus.all.length === 0 ? (
              <Box textAlign="center" py={10}>
                <FiAlertCircle size={40} color="#A0AEC0" />
                <Text mt={4} color="gray.500">No active alerts at this time</Text>
              </Box>
            ) : (
              <Tabs 
                colorScheme="blue" 
                variant="enclosed" 
                onChange={(index) => setActiveTab(index)}
                bg={headerBg}
                borderRadius="lg"
                boxShadow="sm"
                borderColor={borderColor}
                borderWidth="1px"
                mb={6}
              >
                <TabList px={4} pt={4}>
                  <Tab _selected={{ bg: useColorModeValue('white', 'gray.700') }}>
                    All 
                    <Badge ml={2} colorScheme="blue" borderRadius="full">
                      {alertsByStatus.all.length}
                    </Badge>
                  </Tab>
                  <Tab _selected={{ bg: useColorModeValue('white', 'gray.700') }}>
                    New 
                    <Badge ml={2} colorScheme="red" borderRadius="full">
                      {alertsByStatus.new.length}
                    </Badge>
                  </Tab>
                  <Tab _selected={{ bg: useColorModeValue('white', 'gray.700') }}>
                    Acknowledged 
                    <Badge ml={2} colorScheme="purple" borderRadius="full">
                      {alertsByStatus.acknowledged.length}
                    </Badge>
                  </Tab>
                  <Tab _selected={{ bg: useColorModeValue('white', 'gray.700') }}>
                    Resolved 
                    <Badge ml={2} colorScheme="green" borderRadius="full">
                      {alertsByStatus.resolved.length}
                    </Badge>
                  </Tab>
                </TabList>
                
                <TabPanels>
                  <TabPanel>
                    {alertsByStatus.all.length > 0 ? (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {alertsByStatus.all.map(alert => (
                          <AlertCard 
                            key={alert.id} 
                            alert={alert}
                            onAcknowledge={handleAcknowledge}
                            onResolve={handleResolve} 
                          />
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Box textAlign="center" py={10}>
                        <FiAlertCircle size={50} style={{ margin: '0 auto 20px' }} />
                        <Heading size="md" mb={2}>No alerts found</Heading>
                        <Text mb={4} color={subtitleColor}>
                          No alerts match your current filter criteria.
                        </Text>
                        <Button onClick={resetFilters} colorScheme="blue" size="sm">
                          Reset Filters
                        </Button>
                      </Box>
                    )}
                  </TabPanel>
                  
                  <TabPanel>
                    {alertsByStatus.new.length > 0 ? (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {alertsByStatus.new.map(alert => (
                          <AlertCard 
                            key={alert.id} 
                            alert={alert}
                            onAcknowledge={handleAcknowledge}
                            onResolve={handleResolve} 
                          />
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Box textAlign="center" py={10}>
                        <FiCheckCircle size={50} style={{ margin: '0 auto 20px' }} />
                        <Heading size="md" mb={2}>No new alerts</Heading>
                        <Text color={subtitleColor}>
                          There are no new alerts that need your attention.
                        </Text>
                      </Box>
                    )}
                  </TabPanel>
                  
                  <TabPanel>
                    {alertsByStatus.acknowledged.length > 0 ? (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {alertsByStatus.acknowledged.map(alert => (
                          <AlertCard 
                            key={alert.id} 
                            alert={alert}
                            onAcknowledge={handleAcknowledge}
                            onResolve={handleResolve} 
                          />
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Box textAlign="center" py={10}>
                        <FiInfo size={50} style={{ margin: '0 auto 20px' }} />
                        <Heading size="md" mb={2}>No acknowledged alerts</Heading>
                        <Text color={subtitleColor}>
                          There are no alerts currently in the acknowledged state.
                        </Text>
                      </Box>
                    )}
                  </TabPanel>
                  
                  <TabPanel>
                    {alertsByStatus.resolved.length > 0 ? (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        {alertsByStatus.resolved.map(alert => (
                          <AlertCard 
                            key={alert.id} 
                            alert={alert}
                            onAcknowledge={handleAcknowledge}
                            onResolve={handleResolve} 
                          />
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Box textAlign="center" py={10}>
                        <FiAlertCircle size={50} style={{ margin: '0 auto 20px' }} />
                        <Heading size="md" mb={2}>No resolved alerts</Heading>
                        <Text color={subtitleColor}>
                          There are no resolved alerts in the system.
                        </Text>
                      </Box>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </CardBody>
        </Card>
        
        {/* New Alert Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Alert</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                <FormControl isRequired>
                  <FormLabel>City</FormLabel>
                  <Select
                    name="city"
                    value={newAlert.city}
                    onChange={handleInputChange}
                    isDisabled={!!user?.city}
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </Select>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="type"
                    value={newAlert.type}
                    onChange={handleInputChange}
                  >
                    <option value="Traffic Congestion">Traffic Congestion</option>
                    <option value="Air Quality">Air Quality</option>
                    <option value="Power Outage">Power Outage</option>
                    <option value="Flooding">Flooding</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Traffic Diversion">Traffic Diversion</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              
              <FormControl isRequired mb={4}>
                <FormLabel>Severity</FormLabel>
                <Select
                  name="severity"
                  value={newAlert.severity}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </Select>
              </FormControl>
              
              <FormControl isRequired mb={4}>
                <FormLabel>Location</FormLabel>
                <Input
                  name="location"
                  value={newAlert.location}
                  onChange={handleInputChange}
                  placeholder="Specific location of the alert"
                />
              </FormControl>
              
              <FormControl isRequired mb={4}>
                <FormLabel>Message</FormLabel>
                <Textarea
                  name="message"
                  value={newAlert.message}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the alert"
                  rows={4}
                />
              </FormControl>
            </ModalBody>
            
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleCreateAlert}>
                Create Alert
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default Alerts; 