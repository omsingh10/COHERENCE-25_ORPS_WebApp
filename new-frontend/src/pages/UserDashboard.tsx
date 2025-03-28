import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  HStack,
  VStack,
  Button,
  useColorModeValue,
  Badge,
  Progress,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { FiTrendingUp, FiUsers, FiAlertCircle, FiDroplet, FiActivity, FiSun, FiWind, FiMap } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  
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
          Dashboard
        </Heading>
        <Text color={subtitleColor} mb={6}>
          Welcome back, {user?.name || 'User'}
        </Text>
        
        {/* City Information */}
        {user?.city && (
          <Box mb={8}>
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg" mb={4}>
              <CardBody>
                <Flex justify="space-between" align="flex-start">
                  <Box>
                    <Heading size="md" mb={2}>{user.city} Overview</Heading>
                    <Text color={subtitleColor}>Current city status and statistics</Text>
                  </Box>
                  <Badge colorScheme="green" p={2} borderRadius="md">
                    Active
                  </Badge>
                </Flex>
              </CardBody>
            </Card>
          </Box>
        )}
        
        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <StatCard
            title="Air Quality"
            stat="72"
            icon={FiWind}
            description="Moderate"
            color="yellow.500"
          />
          <StatCard
            title="Traffic"
            stat="85%"
            icon={FiActivity}
            description="Moving freely"
            color="green.500"
          />
          <StatCard
            title="Energy Usage"
            stat="45.2 MW"
            icon={FiSun}
            description="-2.3% from yesterday"
            color="orange.500"
          />
          <StatCard
            title="Water Levels"
            stat="Normal"
            icon={FiDroplet}
            description="All reservoirs at capacity"
            color="blue.500"
          />
        </SimpleGrid>
        
        <Tabs colorScheme="blue" size="lg" variant="enclosed" mb={6} onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab>City Status</Tab>
            <Tab>Alerts</Tab>
            <Tab>Reports</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel p={0} pt={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg">
                  <CardBody>
                    <Heading size="md" mb={4}>Resource Usage</Heading>
                    
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Energy Consumption</Text>
                          <Text fontWeight="bold">72%</Text>
                        </Flex>
                        <Progress value={72} colorScheme="green" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Water Usage</Text>
                          <Text fontWeight="bold">45%</Text>
                        </Flex>
                        <Progress value={45} colorScheme="blue" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Traffic Density</Text>
                          <Text fontWeight="bold">60%</Text>
                        </Flex>
                        <Progress value={60} colorScheme="orange" borderRadius="md" />
                      </Box>
                      
                      <Box>
                        <Flex justify="space-between" mb={2}>
                          <Text>Public Transport Use</Text>
                          <Text fontWeight="bold">83%</Text>
                        </Flex>
                        <Progress value={83} colorScheme="purple" borderRadius="md" />
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg">
                  <CardBody>
                    <Heading size="md" mb={4}>Recent Activity</Heading>
                    
                    <VStack spacing={4} align="stretch">
                      <ActivityItem 
                        title="Traffic Alert"
                        description="Congestion reported on Highway 101"
                        time="10 minutes ago"
                        type="alert"
                      />
                      <ActivityItem 
                        title="Water Quality"
                        description="All parameters within normal range"
                        time="1 hour ago"
                        type="info"
                      />
                      <ActivityItem 
                        title="Power Consumption"
                        description="Peak load reduced by 12%"
                        time="3 hours ago"
                        type="success"
                      />
                      <ActivityItem 
                        title="System Maintenance"
                        description="Scheduled maintenance completed"
                        time="Yesterday"
                        type="info"
                      />
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel p={0} pt={4}>
              <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg">
                <CardBody>
                  <Heading size="md" mb={4}>Active Alerts</Heading>
                  
                  <VStack spacing={4} align="stretch">
                    <AlertItem
                      title="Traffic Congestion"
                      description="Heavy traffic on Main Street due to construction work."
                      severity="medium"
                      time="Started 2 hours ago"
                    />
                    <AlertItem
                      title="Air Quality Warning"
                      description="Air quality index approaching unhealthy levels in downtown area."
                      severity="high"
                      time="Started 30 minutes ago"
                    />
                    <AlertItem
                      title="Scheduled Power Maintenance"
                      description="Brief power interruption scheduled for North District at 2:00 PM."
                      severity="low"
                      time="Starts in 3 hours"
                    />
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel p={0} pt={4}>
              <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" borderRadius="lg">
                <CardBody>
                  <Heading size="md" mb={4}>Recent Reports</Heading>
                  
                  <VStack spacing={4} align="stretch">
                    <ReportItem
                      title="Monthly Water Quality Report"
                      description="Comprehensive analysis of water quality parameters across the city."
                      date="May 15, 2023"
                      type="Water Management"
                    />
                    <ReportItem
                      title="Traffic Flow Analysis"
                      description="Peak hour traffic patterns and congestion points."
                      date="May 10, 2023"
                      type="Transportation"
                    />
                    <ReportItem
                      title="Energy Consumption Trends"
                      description="Analysis of energy usage patterns across different zones."
                      date="April 30, 2023"
                      type="Energy"
                    />
                  </VStack>
                  
                  <Button colorScheme="blue" variant="outline" mt={4} width="full">
                    View All Reports
                  </Button>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <HStack spacing={4} mb={6}>
          <Button 
            leftIcon={<FiMap />} 
            colorScheme="blue" 
            variant="solid" 
            size="lg" 
            flex="1"
          >
            View City Map
          </Button>
          <Button 
            leftIcon={<FiAlertCircle />} 
            colorScheme="orange" 
            variant="outline" 
            size="lg" 
            flex="1"
          >
            View All Alerts
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

// Helper component for stats
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

// Activity Item Component
const ActivityItem = ({ title, description, time, type }: {
  title: string;
  description: string;
  time: string;
  type: 'info' | 'alert' | 'success';
}) => {
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'alert': return 'red.500';
      case 'success': return 'green.500';
      default: return 'blue.500';
    }
  };
  
  const color = getTypeColor(type);
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <Flex borderLeft="4px solid" borderColor={color} pl={3} py={1}>
      <Box>
        <Text fontWeight="bold">{title}</Text>
        <Text fontSize="sm">{description}</Text>
        <Text fontSize="xs" color={subtitleColor} mt={1}>{time}</Text>
      </Box>
    </Flex>
  );
};

// Alert Item Component
const AlertItem = ({ title, description, severity, time }: {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  time: string;
}) => {
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      default: return 'gray';
    }
  };
  
  const color = getSeverityColor(severity);
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box borderWidth="1px" borderRadius="md" p={3} borderColor={borderColor}>
      <Flex justify="space-between" mb={2}>
        <Text fontWeight="bold">{title}</Text>
        <Badge colorScheme={color}>{severity}</Badge>
      </Flex>
      <Text fontSize="sm">{description}</Text>
      <Text fontSize="xs" color={subtitleColor} mt={2}>{time}</Text>
    </Box>
  );
};

// Report Item Component
const ReportItem = ({ title, description, date, type }: {
  title: string;
  description: string;
  date: string;
  type: string;
}) => {
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box borderWidth="1px" borderRadius="md" p={3} borderColor={borderColor}>
      <Flex justify="space-between" mb={2}>
        <Text fontWeight="bold">{title}</Text>
        <Badge>{type}</Badge>
      </Flex>
      <Text fontSize="sm">{description}</Text>
      <Text fontSize="xs" color={subtitleColor} mt={2}>Published: {date}</Text>
    </Box>
  );
};

export default UserDashboard; 