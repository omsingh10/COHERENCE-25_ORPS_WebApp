import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  Container, 
  useColorModeValue, 
  SimpleGrid, 
  Flex, 
  Icon,
  Badge,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Image,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiBarChart2, FiUsers, FiBell, FiMapPin, FiSettings, FiActivity, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import WeatherCard from '../components/WeatherCard';
import TomTomMap from '../components/TomTomMap';

// Major cities for weather highlights
const MAJOR_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'];

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)'
  );
  
  // Get the correct dashboard path based on user role
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/user-dashboard';
  
  // Define feature cards based on role
  const getFeatureCards = () => {
    const commonFeatures = [
      { icon: FiBarChart2, title: 'Data Visualization', description: 'Interactive charts and graphs for easy monitoring' },
      { icon: FiBell, title: 'Smart Alerts', description: 'Get notified when critical thresholds are reached' },
    ];
    
    const adminFeatures = [
      { icon: FiUsers, title: 'User Management', description: 'Add, edit, and manage user permissions' },
      { icon: FiSettings, title: 'System Configuration', description: 'Fine-tune system parameters and thresholds' },
    ];
    
    const userFeatures = [
      { icon: FiMapPin, title: 'City Selection', description: 'Monitor different cities with ease' },
      { icon: FiSettings, title: 'Customizable Dashboard', description: 'Personalize your views and preferences' },
    ];
    
    return [...commonFeatures, ...(user?.role === 'admin' ? adminFeatures : userFeatures)];
  };
  
  // Stats for logged-in users
  const getQuickStats = () => {
    if (user?.role === 'admin') {
      return [
        { label: 'Active Users', value: '245', helpText: '+12% from last week' },
        { label: 'Alerts Triggered', value: '18', helpText: 'In the last 24 hours' },
        { label: 'System Uptime', value: '99.9%', helpText: 'Last 30 days' },
      ];
    } else {
      return [
        { label: 'Air Quality', value: '72', helpText: 'Moderate' },
        { label: 'Traffic Congestion', value: '45%', helpText: 'Below average' },
        { label: 'Power Consumption', value: '156 kWh', helpText: '-12% from yesterday' },
      ];
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.100', 'gray.600');
  const statColor = useColorModeValue('blue.600', 'blue.200');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const featureBg = useColorModeValue('blue.50', 'blue.900');

  return (
    <Box bg={bgColor} minH="100vh">
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('blue.50', 'gray.800')}
        pt={{ base: 16, md: 24 }}
        pb={{ base: 10, md: 16 }}
      >
        <Container maxW="container.xl">
          <Flex direction={{ base: 'column', md: 'row' }} align="center">
            <Box maxW={{ base: '100%', md: '50%' }} mb={{ base: 8, md: 0 }}>
              <Heading
                as="h1"
                size="2xl"
                fontWeight="bold"
                mb={4}
                lineHeight="1.2"
                color={textColor}
              >
                Smart City Operations & Planning System
              </Heading>
              <Text fontSize="xl" mb={6} color={subtitleColor}>
                Empowering urban management with real-time analytics and insights for smarter, more sustainable cities.
              </Text>
              <HStack spacing={4}>
                {user ? (
                  <Button
                    as={RouterLink}
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    colorScheme="blue"
                    size="lg"
                    rightIcon={<FiArrowRight />}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button
                    as={RouterLink}
                    to="/login"
                    colorScheme="blue"
                    size="lg"
                    rightIcon={<FiArrowRight />}
                  >
                    Login to System
                  </Button>
                )}
                <Button
                  as={RouterLink}
                  to="/city-map"
                  variant="outline"
                  colorScheme="blue"
                  size="lg"
                >
                  Explore City Map
                </Button>
              </HStack>
            </Box>
            <Box maxW={{ base: '100%', md: '50%' }} pl={{ base: 0, md: 10 }}>
              <Image
                src="/assets/smart-city.svg"
                alt="Smart City Illustration"
                w="full"
                h="auto"
              />
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Weather Highlights Section */}
      <Container maxW="container.xl" py={10}>
        <Heading as="h2" size="xl" mb={6} color={textColor}>
          Weather Highlights
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={10}>
          {MAJOR_CITIES.map(city => (
            <WeatherCard key={city} city={city} variant="compact" />
          ))}
        </SimpleGrid>
      </Container>
      
      {/* Traffic Map Showcase */}
      <Box py={10} bg={useColorModeValue('gray.50', 'gray.800')}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={6} color={textColor}>
            Real-Time Traffic Monitoring
          </Heading>
          <Text fontSize="lg" mb={8} color={subtitleColor}>
            Our platform provides advanced real-time traffic monitoring capabilities with TomTom Maps integration.
          </Text>
          
          <Box 
            borderRadius="lg" 
            overflow="hidden" 
            boxShadow="xl" 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor}
            mb={6}
          >
            <TomTomMap 
              city="Mumbai" 
              height="500px" 
              showTraffic={true} 
              showIncidents={true} 
            />
          </Box>
          
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <FeatureCard
              icon={FiMapPin}
              title="Live Traffic Data"
              description="Monitor traffic congestion, incidents, and flow in real-time across the city."
            />
            <FeatureCard
              icon={FiAlertCircle}
              title="Incident Tracking"
              description="Track and respond to traffic incidents, road closures, and other events instantly."
            />
            <FeatureCard
              icon={FiActivity}
              title="Traffic Trends"
              description="Analyze traffic patterns and trends to optimize city infrastructure and planning."
            />
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box py={12} bg={featureBg}>
        <Container maxW="container.xl">
          <Heading as="h2" size="xl" mb={10} textAlign="center" color={textColor}>
            Key Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
            <FeatureCard
              icon={FiMapPin}
              title="City Visualization"
              description="Interactive maps with real-time data overlays for traffic, air quality, and energy consumption."
            />
            <FeatureCard
              icon={FiBarChart2}
              title="Advanced Analytics"
              description="Comprehensive dashboards with predictive analytics to identify patterns and trends."
            />
            <FeatureCard
              icon={FiActivity}
              title="Live Monitoring"
              description="24/7 monitoring of critical infrastructure and environmental conditions across the city."
            />
            <FeatureCard
              icon={FiUsers}
              title="Multi-User Platform"
              description="Role-based access for citizens, city officials, and administrators with tailored experiences."
            />
            <FeatureCard
              icon={FiBarChart2}
              title="Actionable Insights"
              description="Turn data into meaningful insights with powerful visualization tools and recommendations."
            />
            <FeatureCard
              icon={FiActivity}
              title="Alert Management"
              description="Proactive alert system for critical events with integrated response management."
            />
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Stats Section */}
      <Container maxW="container.xl" py={16}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          <StatCard number="6" label="Connected Cities" />
          <StatCard number="250+" label="Data Points" />
          <StatCard number="24/7" label="Monitoring" />
          <StatCard number="99.9%" label="System Uptime" />
        </SimpleGrid>
      </Container>
      
      {/* CTA Section */}
      <Box bg={accentColor} py={16}>
        <Container maxW="container.md" textAlign="center">
          <Heading color="white" size="xl" mb={4}>
            Ready to experience smart city management?
          </Heading>
          <Text color="whiteAlpha.900" fontSize="lg" mb={8}>
            Join the platform that's transforming urban operations and planning.
          </Text>
          <Button
            as={RouterLink}
            to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'}
            size="lg"
            colorScheme="whiteAlpha"
            rightIcon={<FiArrowRight />}
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

// Helper Components
const FeatureCard = ({ icon, title, description }: { icon: any; title: string; description: string }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="lg" shadow="md">
      <CardBody>
        <Flex direction="column" align="center" textAlign="center">
          <Box
            bg={useColorModeValue('blue.100', 'blue.900')}
            p={3}
            borderRadius="full"
            mb={4}
          >
            <Icon as={icon} boxSize={6} color={useColorModeValue('blue.500', 'blue.200')} />
          </Box>
          <Heading as="h3" size="md" mb={2}>
            {title}
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            {description}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  );
};

const StatCard = ({ number, label }: { number: string; label: string }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="lg" shadow="md">
      <CardBody>
        <VStack spacing={2} align="center" textAlign="center">
          <Heading size="2xl" color={useColorModeValue('blue.500', 'blue.300')}>
            {number}
          </Heading>
          <Text fontWeight="medium" color={useColorModeValue('gray.700', 'gray.300')}>
            {label}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default Home; 