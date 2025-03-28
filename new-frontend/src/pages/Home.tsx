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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiBarChart2, FiUsers, FiBell, FiMapPin, FiSettings } from 'react-icons/fi';

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

  return (
    <Box bg="white" minH="100vh">
      <Container maxW="container.xl" py={10}>
        {isAuthenticated ? (
          // Logged-in view
          <Box>
            <Flex justify="space-between" align="center" mb={8}>
              <Box>
                <Heading as="h1" size="xl" mb={2}>
                  Welcome back, {user?.name}
                  {user?.role === 'admin' && <Badge ml={2} colorScheme="purple">Admin</Badge>}
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  {user?.role === 'admin' 
                    ? 'Manage your smart city infrastructure from your admin dashboard'
                    : 'Track real-time city metrics and personalized alerts'}
                </Text>
              </Box>
              
              <Button
                as={RouterLink}
                to={dashboardPath}
                size="lg"
                colorScheme="blue"
                rightIcon={<Icon as={FiBarChart2} />}
              >
                Go to Dashboard
              </Button>
            </Flex>
            
            {/* Quick Stats */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={10}>
              {getQuickStats().map((stat, index) => (
                <Box 
                  key={index} 
                  bg="white" 
                  p={6} 
                  borderRadius="lg" 
                  boxShadow="md" 
                  border="1px" 
                  borderColor="gray.100"
                >
                  <Stat>
                    <StatLabel fontSize="md" color="gray.500">{stat.label}</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold" color="blue.600">
                      {stat.value}
                    </StatNumber>
                    <StatHelpText>{stat.helpText}</StatHelpText>
                  </Stat>
                </Box>
              ))}
            </SimpleGrid>
            
            {/* Feature Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {getFeatureCards().map((feature, index) => (
                <Box
                  key={index}
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  border="1px"
                  borderColor="gray.100"
                  transition="transform 0.3s"
                  _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                >
                  <Icon as={feature.icon} boxSize={10} color="blue.500" mb={4} />
                  <Heading size="md" mb={2}>{feature.title}</Heading>
                  <Text color="gray.600">{feature.description}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        ) : (
          // Non-authenticated view
          <VStack spacing={8} textAlign="center" py={10}>
            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              bgGradient={bgGradient}
              bgClip="text"
            >
              OPRS Dashboard
            </Heading>
            
            <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.600" maxW="2xl">
              A powerful operations dashboard for monitoring and managing your systems.
              Get real-time insights, analytics, and alerts all in one place.
            </Text>
            
            <HStack spacing={4} pt={8}>
              <Button
                as={RouterLink}
                to="/login"
                size="lg"
                colorScheme="blue"
                rounded="full"
                px={8}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                Sign In
              </Button>
              
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                variant="outline"
                colorScheme="blue"
                rounded="full"
                px={8}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'sm',
                }}
              >
                Create Account
              </Button>
            </HStack>
            
            <Box pt={16}>
              <Text fontSize="xl" fontWeight="bold" mb={8}>
                Features include:
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
                <VStack>
                  <Icon as={FiBarChart2} boxSize={10} color="blue.500" />
                  <Text fontWeight="bold">Real-time Data</Text>
                  <Text color="gray.600">Monitor metrics as they happen</Text>
                </VStack>
                <VStack>
                  <Icon as={FiBell} boxSize={10} color="blue.500" />
                  <Text fontWeight="bold">Smart Alerts</Text>
                  <Text color="gray.600">Get notified when thresholds are crossed</Text>
                </VStack>
                <VStack>
                  <Icon as={FiMapPin} boxSize={10} color="blue.500" />
                  <Text fontWeight="bold">City Monitoring</Text>
                  <Text color="gray.600">Track multiple cities at once</Text>
                </VStack>
                <VStack>
                  <Icon as={FiUsers} boxSize={10} color="blue.500" />
                  <Text fontWeight="bold">User Management</Text>
                  <Text color="gray.600">Admin controls and permissions</Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default Home; 