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
  VStack,
  HStack,
  Button,
  ButtonGroup,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import { FiHome, FiPieChart, FiMap, FiAlertCircle, FiSettings, FiZoomIn, FiZoomOut, FiPlus, FiMinus } from 'react-icons/fi';
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
  const [activeTab, setActiveTab] = useState('traffic');
  
  // Mock map configurations
  const mapUrls = {
    'Mumbai': 'https://www.openstreetmap.org/export/embed.html?bbox=72.7,18.8,73.1,19.2&layer=mapnik',
    'Delhi': 'https://www.openstreetmap.org/export/embed.html?bbox=76.8,28.4,77.4,28.8&layer=mapnik',
    'Bangalore': 'https://www.openstreetmap.org/export/embed.html?bbox=77.4,12.8,77.8,13.1&layer=mapnik',
    'Chennai': 'https://www.openstreetmap.org/export/embed.html?bbox=80.1,12.9,80.3,13.2&layer=mapnik',
    'Hyderabad': 'https://www.openstreetmap.org/export/embed.html?bbox=78.3,17.3,78.6,17.5&layer=mapnik'
  };

  const mapUrl = mapUrls[selectedCity as keyof typeof mapUrls];
  
  // Convert active tab to readable title
  const getTabTitle = (tab: string) => {
    switch(tab) {
      case 'traffic': return 'Traffic Status';
      case 'environment': return 'Environmental Monitoring';
      case 'infrastructure': return 'Infrastructure Overview';
      default: return 'Map View';
    }
  };

  // Tab description mapping
  const tabDescriptions = {
    'traffic': 'Current traffic conditions across the city, updated in real-time.',
    'environment': 'Air quality, water levels, and other environmental indicators.',
    'infrastructure': 'Status of power grid, water systems, and public transport.'
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
            <Heading as="h1" size="lg">City Map</Heading>
            <Text color="gray.600">Interactive map of city infrastructure and monitoring</Text>
          </Box>
          
          <Select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)} 
            maxW="200px"
            isDisabled={!!user?.city}
            bg="white"
            borderRadius="lg"
          >
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Hyderabad">Hyderabad</option>
          </Select>
        </Flex>
        
        {/* Map buttons */}
        <ButtonGroup mb={4} variant="solid" isAttached>
          <Button 
            colorScheme={activeTab === 'traffic' ? 'blue' : 'gray'} 
            onClick={() => setActiveTab('traffic')}
          >
            Traffic
          </Button>
          <Button 
            colorScheme={activeTab === 'environment' ? 'blue' : 'gray'} 
            onClick={() => setActiveTab('environment')}
          >
            Environment
          </Button>
          <Button 
            colorScheme={activeTab === 'infrastructure' ? 'blue' : 'gray'} 
            onClick={() => setActiveTab('infrastructure')}
          >
            Infrastructure
          </Button>
        </ButtonGroup>
        
        {/* Map container */}
        <Card borderRadius="lg" overflow="hidden" position="relative" height="550px" mb={6}>
          <Box
            as="iframe"
            src={mapUrl}
            width="100%"
            height="100%"
            borderWidth="0"
          />
          
          {/* Map controls */}
          <Box position="absolute" top={4} right={4}>
            <VStack spacing={2}>
              <IconButton
                aria-label="Zoom in"
                icon={<FiPlus />}
                colorScheme="blue"
                size="sm"
                borderRadius="full"
              />
              <IconButton
                aria-label="Zoom out"
                icon={<FiMinus />}
                colorScheme="blue"
                size="sm"
                borderRadius="full"
              />
            </VStack>
          </Box>
          
          {/* Attribution */}
          <Box position="absolute" bottom={2} right={2} fontSize="xs" bg="white" px={2} py={1} borderRadius="md" opacity={0.8}>
            <Text>© OpenStreetMap contributors</Text>
          </Box>
        </Card>
        
        {/* Info sections below map */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
          <InfoBox 
            title={activeTab === 'traffic' ? "Traffic Status" : (activeTab === 'environment' ? "Environmental Monitoring" : "Infrastructure Overview")}
            description={tabDescriptions[activeTab as keyof typeof tabDescriptions]}
          />
          
          {activeTab === 'traffic' && (
            <>
              <InfoBox 
                title="Traffic Congestion Points"
                description="Main Street & 5th Avenue - Heavy traffic due to accident. Western Express Highway - Moderate congestion."
              />
              <InfoBox 
                title="Recommended Routes"
                description="Avoid North-South Highway between 4-7pm. Eastern Express route currently clear."
              />
            </>
          )}
          
          {activeTab === 'environment' && (
            <>
              <InfoBox 
                title="Air Quality Monitoring"
                description="AQI in Downtown area: 68 (Moderate). PM2.5 levels currently within acceptable range."
              />
              <InfoBox 
                title="Water Levels"
                description="Reservoir levels at 68%. Lake City water treatment plant operating at normal capacity."
              />
            </>
          )}
          
          {activeTab === 'infrastructure' && (
            <>
              <InfoBox 
                title="Power Grid Status"
                description="All substations operational. Scheduled maintenance in South District on Saturday."
              />
              <InfoBox 
                title="Public Transport"
                description="Subway lines operating normally. Bus route 42 diverted due to road repairs."
              />
            </>
          )}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default CityMap; 