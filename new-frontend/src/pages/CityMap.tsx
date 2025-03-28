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
  ButtonGroup,
  IconButton,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  useToast,
  FormControl,
  Switch,
  FormLabel,
} from '@chakra-ui/react';
import { FiHome, FiPieChart, FiMap, FiAlertCircle, FiSettings, FiZoomIn, FiZoomOut, FiPlus, FiMinus } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import LiveMap from '../components/LiveMap';
import { getAllCities } from '../utils/realTimeData';

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
        <SidebarItem icon={<FiMap size={18} />} to="/city-map" isActive>City Map</SidebarItem>
        <SidebarItem icon={<FiAlertCircle size={18} />} to="/alerts">Alerts</SidebarItem>
        <SidebarItem icon={<FiSettings size={18} />} to="/settings">Settings</SidebarItem>
      </VStack>
    </Box>
  );
};

// InfoBox component for the map
const InfoBox = ({ title, description }: { title: string, description: string }) => {
  return (
    <Card borderRadius="md" boxShadow="md" bg="white" mb={4}>
      <CardBody p={4}>
        <Heading size="sm" mb={2}>{title}</Heading>
        <Text fontSize="sm" color="gray.600">{description}</Text>
      </CardBody>
    </Card>
  );
};

const CityMap = () => {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState(user?.city || 'Mumbai');
  const [activeTab, setActiveTab] = useState(0);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showInfrastructure, setShowInfrastructure] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  // Get all available cities
  const cities = getAllCities();
  
  // Color mode values
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const tabBg = useColorModeValue('white', 'gray.700');
  
  // Handle city change
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => setLoading(false), 500);
    
    toast({
      title: 'City updated',
      description: `Displaying map for ${newCity}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };
  
  return (
    <Box minH="100vh" bg={bg} pt="80px">
      <Box maxW="1400px" mx="auto" px={4}>
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading as="h1" size="lg" color={textColor}>City Map</Heading>
            <Text color={subtitleColor}>
              Interactive map of city infrastructure and monitoring
            </Text>
          </Box>
          
          {(!user?.city || user?.role === 'admin') && (
            <FormControl w="200px">
              <Select 
                value={selectedCity} 
                onChange={handleCityChange}
                bg={cardBg}
                borderRadius="lg"
                borderColor={borderColor}
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
            </FormControl>
          )}
        </Flex>
        
        <Tabs 
          colorScheme="blue" 
          variant="soft-rounded" 
          onChange={(index) => setActiveTab(index)}
          mb={6}
        >
          <TabList overflowX="auto" py={2}>
            <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Traffic</Tab>
            <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Environment</Tab>
            <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Infrastructure</Tab>
          </TabList>
          
          <TabPanels>
            {/* Traffic Tab */}
            <TabPanel p={0} pt={4}>
              <Box 
                borderRadius="lg" 
                overflow="hidden" 
                boxShadow="md"
                bg={cardBg}
                height="calc(100vh - 220px)"
                position="relative"
              >
                <LiveMap city={selectedCity} height="100%" />
                
                {/* Map Controls Panel */}
                <Box 
                  position="absolute" 
                  top={4} 
                  right={4} 
                  bg={cardBg} 
                  p={3} 
                  borderRadius="md" 
                  boxShadow="md"
                  borderColor={borderColor}
                  borderWidth="1px"
                >
                  <Heading size="sm" mb={2}>Map Controls</Heading>
                  <FormControl display="flex" alignItems="center" mb={2}>
                    <Switch 
                      isChecked={showTraffic} 
                      onChange={() => setShowTraffic(!showTraffic)} 
                      colorScheme="red" 
                      id="traffic-toggle"
                    />
                    <FormLabel htmlFor="traffic-toggle" mb={0} ml={2} fontSize="sm">
                      Show Traffic
                    </FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <Switch 
                      isChecked={showInfrastructure} 
                      onChange={() => setShowInfrastructure(!showInfrastructure)} 
                      colorScheme="blue" 
                      id="infrastructure-toggle"
                    />
                    <FormLabel htmlFor="infrastructure-toggle" mb={0} ml={2} fontSize="sm">
                      Show Infrastructure
                    </FormLabel>
                  </FormControl>
                </Box>
              </Box>
            </TabPanel>
            
            {/* Environment Tab */}
            <TabPanel p={0} pt={4}>
              <Box 
                borderRadius="lg" 
                overflow="hidden" 
                boxShadow="md"
                bg={cardBg}
                height="calc(100vh - 220px)"
              >
                <LiveMap city={selectedCity} height="100%" />
                
                {/* Environment layer controls would go here */}
                <Box 
                  position="absolute" 
                  top={4} 
                  right={4} 
                  bg={cardBg} 
                  p={3} 
                  borderRadius="md" 
                  boxShadow="md"
                  borderColor={borderColor}
                  borderWidth="1px"
                >
                  <Heading size="sm" mb={2}>Environment Layers</Heading>
                  <FormControl display="flex" alignItems="center" mb={2}>
                    <Switch colorScheme="green" id="air-quality-toggle" />
                    <FormLabel htmlFor="air-quality-toggle" mb={0} ml={2} fontSize="sm">
                      Air Quality
                    </FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center" mb={2}>
                    <Switch colorScheme="blue" id="water-quality-toggle" />
                    <FormLabel htmlFor="water-quality-toggle" mb={0} ml={2} fontSize="sm">
                      Water Bodies
                    </FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <Switch colorScheme="purple" id="noise-toggle" />
                    <FormLabel htmlFor="noise-toggle" mb={0} ml={2} fontSize="sm">
                      Noise Levels
                    </FormLabel>
                  </FormControl>
                </Box>
              </Box>
            </TabPanel>
            
            {/* Infrastructure Tab */}
            <TabPanel p={0} pt={4}>
              <Box 
                borderRadius="lg" 
                overflow="hidden" 
                boxShadow="md"
                bg={cardBg}
                height="calc(100vh - 220px)"
              >
                <LiveMap city={selectedCity} height="100%" />
                
                {/* Infrastructure layer controls would go here */}
                <Box 
                  position="absolute" 
                  top={4} 
                  right={4} 
                  bg={cardBg} 
                  p={3} 
                  borderRadius="md" 
                  boxShadow="md"
                  borderColor={borderColor}
                  borderWidth="1px"
                >
                  <Heading size="sm" mb={2}>Infrastructure Layers</Heading>
                  <FormControl display="flex" alignItems="center" mb={2}>
                    <Switch colorScheme="blue" id="public-transport-toggle" />
                    <FormLabel htmlFor="public-transport-toggle" mb={0} ml={2} fontSize="sm">
                      Public Transport
                    </FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center" mb={2}>
                    <Switch colorScheme="yellow" id="energy-grid-toggle" />
                    <FormLabel htmlFor="energy-grid-toggle" mb={0} ml={2} fontSize="sm">
                      Energy Grid
                    </FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <Switch colorScheme="cyan" id="water-supply-toggle" />
                    <FormLabel htmlFor="water-supply-toggle" mb={0} ml={2} fontSize="sm">
                      Water Supply
                    </FormLabel>
                  </FormControl>
                </Box>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default CityMap; 