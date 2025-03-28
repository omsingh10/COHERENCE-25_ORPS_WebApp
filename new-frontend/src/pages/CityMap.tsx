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
import TomTomMap from '../components/TomTomMap';
import WeatherCard from '../components/WeatherCard';
import { getAllCities } from '../utils/realTimeData';
import Sidebar from '../components/Sidebar';

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
  const [showIncidents, setShowIncidents] = useState(true);
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
    <Box>
      <Sidebar />
      <Box minH="100vh" bg={bg} ml={{ base: 0, md: 60 }} pt={{ base: "20", md: 6 }} px={4}>
        <Box maxW="1400px" mx="auto">
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Heading as="h1" size="lg" color={textColor}>City Map</Heading>
              <Text color={subtitleColor}>
                Interactive map of city infrastructure with real-time traffic data
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
          
          {/* Weather Card */}
          <Box mb={6}>
            <WeatherCard city={selectedCity} />
          </Box>
          
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
                  position="relative"
                >
                  <TomTomMap 
                    city={selectedCity} 
                    height="calc(100vh - 220px)" 
                    showTraffic={showTraffic}
                    showIncidents={showIncidents}
                  />
                  
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
                    zIndex={5}
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
                        Show Traffic Flow
                      </FormLabel>
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <Switch 
                        isChecked={showIncidents} 
                        onChange={() => setShowIncidents(!showIncidents)} 
                        colorScheme="orange" 
                        id="incidents-toggle"
                      />
                      <FormLabel htmlFor="incidents-toggle" mb={0} ml={2} fontSize="sm">
                        Show Incidents
                      </FormLabel>
                    </FormControl>
                  </Box>
                </Box>
              </TabPanel>
              
              {/* Environment Tab */}
              <TabPanel p={0} pt={4}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4} mb={4}>
                  <WeatherCard city={selectedCity} />
                  <Box 
                    borderRadius="lg" 
                    overflow="hidden" 
                    boxShadow="md"
                    bg={cardBg}
                    p={4}
                  >
                    <Heading size="md" mb={4}>Environmental Monitoring</Heading>
                    <Text>Environmental data for {selectedCity} is being loaded...</Text>
                  </Box>
                </SimpleGrid>
                
                <Box 
                  borderRadius="lg" 
                  overflow="hidden" 
                  boxShadow="md"
                  bg={cardBg}
                  height="calc(100vh - 440px)"
                >
                  <TomTomMap 
                    city={selectedCity} 
                    height="100%" 
                    showTraffic={false}
                    showIncidents={false}
                  />
                  
                  {/* Environment layer controls */}
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
                    zIndex={5}
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
                  <TomTomMap 
                    city={selectedCity} 
                    height="100%" 
                    showTraffic={false}
                    showIncidents={false}
                  />
                  
                  {/* Infrastructure layer controls */}
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
                    zIndex={5}
                  >
                    <Heading size="sm" mb={2}>Infrastructure Layers</Heading>
                    <FormControl display="flex" alignItems="center" mb={2}>
                      <Switch 
                        isChecked={showInfrastructure}
                        onChange={() => setShowInfrastructure(!showInfrastructure)}
                        colorScheme="blue" 
                        id="public-transport-toggle" 
                      />
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
    </Box>
  );
};

export default CityMap; 