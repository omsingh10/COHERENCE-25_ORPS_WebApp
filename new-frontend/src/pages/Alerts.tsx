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
} from '@chakra-ui/react';
import { FiHome, FiPieChart, FiMap, FiAlertCircle, FiSettings, FiPlus, FiFilter, FiRefreshCw, FiMoreVertical, FiTrash2, FiEdit, FiUpload, FiFile } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

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
        <SidebarItem icon={<FiPieChart size={18} />} to="/analytics">Analytics</SidebarItem>
        <SidebarItem icon={<FiMap size={18} />} to="/city-map">City Map</SidebarItem>
        <SidebarItem icon={<FiAlertCircle size={18} />} to="/alerts" isActive>Alerts</SidebarItem>
        <SidebarItem icon={<FiSettings size={18} />} to="/settings">Settings</SidebarItem>
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

const Alerts = () => {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState(user?.city || 'Mumbai');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [alertType, setAlertType] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('Medium');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertLocation, setAlertLocation] = useState('');
  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState(initialAlerts);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();
  
  // Filter alerts based on selection
  useEffect(() => {
    let filtered = [...alerts];
    
    if (selectedCity !== 'All Cities') {
      filtered = filtered.filter(alert => alert.city === selectedCity);
    }
    
    if (filter === 'all') return filtered;
    if (filter === 'high') return filtered.filter(alert => alert.severity === 'high');
    if (filter === 'medium') return filtered.filter(alert => alert.severity === 'medium');
    if (filter === 'low') return filtered.filter(alert => alert.severity === 'low');
    return filtered;
  }, [alerts, selectedCity, filter]);
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} minutes ago`;
    
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} hours ago`;
    
    return date.toLocaleDateString();
  };
  
  // Handle Alert Creation
  const handleCreateAlert = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Get form data
    const form = e.currentTarget;
    const formData = new FormData(form);
    const city = formData.get('city') as string;
    const type = formData.get('type') as string;
    const severity = formData.get('severity') as string;
    const message = formData.get('message') as string;
    
    // In a real application, you would upload the image and get a URL
    // For this demo, we'll use the preview URL if an image was selected
    
    // Simulate API request delay
    setTimeout(() => {
      const newAlert = {
        id: alerts.length + 1,
        city,
        type,
        severity,
        message,
        createdAt: new Date().toISOString(),
        status: 'active',
        image: imagePreview
      };
      
      setAlerts([newAlert, ...alerts]);
      
      toast({
        title: 'Alert created',
        description: `The alert for ${city} has been created successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setIsLoading(false);
      setSelectedImage(null);
      setImagePreview(null);
      onClose();
      
      // Reset form (would be done differently in a real app)
      form.reset();
    }, 1500);
  };
  
  // Handle image upload
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
  
  // Update alert status
  const updateAlertStatus = (id: number, newStatus: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === id ? { ...alert, status: newStatus } : alert
    );
    setAlerts(updatedAlerts);
    
    toast({
      title: 'Alert updated',
      description: `Alert status changed to ${newStatus}.`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Delete an alert
  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    
    toast({
      title: 'Alert deleted',
      description: 'The alert has been removed.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const cardBg = useColorModeValue('white', 'gray.700');
  
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
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              maxW="150px"
              bg="white"
              borderRadius="lg"
            >
              <option value="all">All Alerts</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </Select>
          </HStack>
        </Flex>
        
        {/* Alerts List */}
        <Card borderRadius="lg" boxShadow="sm" bg={cardBg} mb={6}>
          <CardBody p={6}>
            {filteredAlerts.length === 0 ? (
              <Box textAlign="center" py={10}>
                <FiAlertCircle size={40} color="#A0AEC0" />
                <Text mt={4} color="gray.500">No active alerts at this time</Text>
              </Box>
            ) : (
              <VStack spacing={4} align="stretch">
                {filteredAlerts.map(alert => (
                  <Card key={alert.id} bg={cardBg} overflow="hidden">
                    <CardBody>
                      <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                        {alert.image && (
                          <Box 
                            minW={{ base: '100%', md: '200px' }} 
                            maxW={{ base: '100%', md: '200px' }}
                            height={{ base: '180px', md: '140px' }}
                            borderRadius="md"
                            overflow="hidden"
                          >
                            <Image 
                              src={alert.image} 
                              alt={`Alert in ${alert.city}`}
                              objectFit="cover"
                              width="100%"
                              height="100%"
                            />
                          </Box>
                        )}
                        <Box flex="1">
                          <Flex justify="space-between" wrap="wrap" mb={2}>
                            <HStack>
                              <Badge colorScheme={alertTypes[alert.type as keyof typeof alertTypes] || 'gray'}>
                                {alert.type}
                              </Badge>
                              <Badge colorScheme={severityColors[alert.severity as keyof typeof severityColors]}>
                                {alert.severity} severity
                              </Badge>
                              <Badge colorScheme={statusColors[alert.status as keyof typeof statusColors]}>
                                {alert.status}
                              </Badge>
                            </HStack>
                            <Menu>
                              <MenuButton 
                                as={IconButton}
                                icon={<FiMoreVertical />}
                                variant="ghost"
                                size="sm"
                              />
                              <MenuList>
                                {alert.status !== 'resolved' && (
                                  <MenuItem 
                                    icon={<FiEdit />} 
                                    onClick={() => updateAlertStatus(alert.id, 'resolved')}
                                  >
                                    Mark as Resolved
                                  </MenuItem>
                                )}
                                {alert.status !== 'active' && (
                                  <MenuItem 
                                    icon={<FiEdit />} 
                                    onClick={() => updateAlertStatus(alert.id, 'active')}
                                  >
                                    Mark as Active
                                  </MenuItem>
                                )}
                                <MenuItem 
                                  icon={<FiTrash2 />} 
                                  color="red.500"
                                  onClick={() => deleteAlert(alert.id)}
                                >
                                  Delete Alert
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Flex>
                          <Heading size="sm" mb={1}>{alert.city}</Heading>
                          <Text color="gray.600" fontSize="sm" mb={2}>
                            {formatDate(alert.createdAt)}
                          </Text>
                          <Text>{alert.message}</Text>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}
          </CardBody>
        </Card>
        
        {/* Create Alert Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <form onSubmit={handleCreateAlert}>
              <ModalHeader>Create New Alert</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>City</FormLabel>
                    <Select name="city" placeholder="Select city" required>
                      {cities.filter(city => city !== 'All Cities').map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Alert Type</FormLabel>
                    <Select name="type" placeholder="Select type" required>
                      {Object.keys(alertTypes).map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Severity</FormLabel>
                    <Select name="severity" placeholder="Select severity" required>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Alert Message</FormLabel>
                    <Textarea 
                      name="message"
                      placeholder="Describe the alert in detail..."
                      rows={4}
                      required
                    />
                  </FormControl>
                  
                  {/* Image Upload */}
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
                      onClick={() => document.getElementById('alert-image-upload')?.click()}
                    >
                      <Input
                        id="alert-image-upload"
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
                        </VStack>
                      )}
                    </Flex>
                  </FormControl>
                </VStack>
              </ModalBody>
              
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  colorScheme="blue" 
                  isLoading={isLoading}
                  loadingText="Creating..."
                >
                  Create Alert
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default Alerts; 