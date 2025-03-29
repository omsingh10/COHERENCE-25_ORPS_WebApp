import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { FiUsers, FiAlertCircle, FiMap, FiBarChart2, FiSettings } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();
  
  // Color mode values
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box minH="100vh" bg={bg} p={5}>
      <Flex 
        direction="column" 
        maxW="1400px" 
        mx="auto"
      >
        <Heading as="h1" size="xl" mb={2} color={textColor}>
          Admin Dashboard
        </Heading>
        <Text color={subtitleColor} mb={6}>
          System overview and management
        </Text>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <StatCard
            title="Total Users"
            stat="1,284"
            icon={FiUsers}
            description="+12% from last month"
            color="blue.500"
          />
          <StatCard
            title="Active Alerts"
            stat="42"
            icon={FiAlertCircle}
            description="15 high priority"
            color="red.500"
          />
          <StatCard
            title="City Nodes"
            stat="568"
            icon={FiMap}
            description="98.7% online"
            color="green.500"
          />
          <StatCard
            title="Daily Analytics"
            stat="12K"
            icon={FiBarChart2}
            description="+8.2% data points"
            color="purple.500"
          />
        </SimpleGrid>
        
        <Tabs colorScheme="blue" size="lg" variant="enclosed" mb={6}>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>User Management</Tab>
            <Tab>Alerts</Tab>
            <Tab>System Settings</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <Box>
                <Heading size="md" mb={4}>System Overview</Heading>
                <Text>Welcome to the admin dashboard for the Smart City management system. From here, you can monitor and manage all aspects of the city's digital infrastructure.</Text>
              </Box>
            </TabPanel>
            
            <TabPanel>
              <Box>
                <Heading size="md" mb={4}>User Management</Heading>
                <Text>This section will allow you to manage system users, their roles and permissions.</Text>
              </Box>
            </TabPanel>
            
            <TabPanel>
              <Box>
                <Heading size="md" mb={4}>Alert Management</Heading>
                <Text>Review and manage all system alerts and notifications. Configure alert thresholds and notification settings.</Text>
              </Box>
            </TabPanel>
            
            <TabPanel>
              <Box>
                <Heading size="md" mb={4}>System Settings</Heading>
                <Text>Configure system-wide settings, backup schedules, and maintenance tasks.</Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};

// Stat Card Component
const StatCard = ({ title, stat, icon, description, color }: { 
  title: string;
  stat: string;
  icon: any;
  description: string;
  color: string;
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg">
      <CardBody>
        <Flex justify="space-between" align="center">
          <Box>
            <Stat>
              <StatLabel fontSize="sm">{title}</StatLabel>
              <StatNumber fontSize="2xl" fontWeight="bold">{stat}</StatNumber>
              <StatHelpText fontSize="xs">{description}</StatHelpText>
            </Stat>
          </Box>
          <Box p={2} borderRadius="full" bg={`${color}20`}>
            <Icon as={icon} boxSize={6} color={color} />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default AdminPanel; 