import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  TabPanel,
  TabPanels,
  TabList,
  Tabs,
  Tab,
  Grid,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  HStack,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon, RepeatIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

const indianCities = [
  'All Cities',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
];

interface User {
  _id: string;
  name: string;
  email: string;
  city: string;
  role: string;
  createdAt: string;
}

interface Alert {
  _id: string;
  type: string;
  message: string;
  timestamp: string;
  city: string;
  read: boolean;
  sentToUsers: number;
}

const AdminPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [alertType, setAlertType] = useState('AirQuality');
  const [city, setCity] = useState('All Cities');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAlerts: 0,
    activeSensors: 0,
    criticalAlerts: 0,
  });
  
  const { user } = useAuth();
  const toast = useToast();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
      fetchAlerts();
      fetchStats();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/alerts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch alerts',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: alertType,
          city: city === 'All Cities' ? null : city,
          message,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create alert');
      }
      
      const data = await response.json();
      
      toast({
        title: 'Alert Created',
        description: `Alert sent to ${data.sentToUsers} users`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      setMessage('');
      
      // Refresh alerts
      fetchAlerts();
      fetchStats();
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to create alert',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/alerts/${alertId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete alert');
      }
      
      // Update local state
      setAlerts(alerts.filter(alert => alert._id !== alertId));
      
      toast({
        title: 'Alert Deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete alert',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'AirQuality':
        return 'orange';
      case 'Traffic':
        return 'red';
      case 'WaterLevel':
        return 'blue';
      case 'Energy':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>Admin Dashboard</Heading>
      
      <Tabs colorScheme="blue" mb={6}>
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>Create Alert</Tab>
          <Tab>Manage Alerts</Tab>
          <Tab>Users</Tab>
        </TabList>
        
        <TabPanels>
          {/* Dashboard Tab */}
          <TabPanel>
            <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
              <Stat
                bg="white"
                p={4}
                shadow="sm"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="blue.400"
              >
                <StatLabel>Total Users</StatLabel>
                <StatNumber>{stats.totalUsers}</StatNumber>
              </Stat>
              
              <Stat
                bg="white"
                p={4}
                shadow="sm"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="green.400"
              >
                <StatLabel>Active Sensors</StatLabel>
                <StatNumber>{stats.activeSensors}</StatNumber>
              </Stat>
              
              <Stat
                bg="white"
                p={4}
                shadow="sm"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="purple.400"
              >
                <StatLabel>Total Alerts</StatLabel>
                <StatNumber>{stats.totalAlerts}</StatNumber>
              </Stat>
              
              <Stat
                bg="white"
                p={4}
                shadow="sm"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="red.400"
              >
                <StatLabel>Critical Alerts</StatLabel>
                <StatNumber>{stats.criticalAlerts}</StatNumber>
              </Stat>
            </Grid>
            
            <Flex justify="flex-end" mb={4}>
              <Button 
                leftIcon={<RepeatIcon />} 
                size="sm" 
                onClick={() => {
                  fetchUsers();
                  fetchAlerts();
                  fetchStats();
                }}
              >
                Refresh Data
              </Button>
            </Flex>
            
            <Box bg="white" p={4} borderRadius="md" shadow="sm">
              <Heading size="md" mb={4}>Recent Alerts</Heading>
              {alerts.length === 0 ? (
                <Text color="gray.500">No alerts to display</Text>
              ) : (
                <VStack align="stretch" spacing={3} maxH="400px" overflowY="auto">
                  {alerts.slice(0, 5).map(alert => (
                    <HStack key={alert._id} p={3} bg="gray.50" borderRadius="md">
                      <Badge colorScheme={getAlertColor(alert.type)}>{alert.type}</Badge>
                      <Text flex="1">{alert.message}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </Text>
                      <Text fontSize="sm">
                        Sent to: <Badge>{alert.sentToUsers}</Badge>
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>
          </TabPanel>
          
          {/* Create Alert Tab */}
          <TabPanel>
            <Box bg="white" p={6} borderRadius="md" shadow="sm">
              <Heading size="md" mb={4}>Create New Alert</Heading>
              
              <form onSubmit={handleCreateAlert}>
                <VStack spacing={4} align="stretch">
                  <Grid templateColumns="1fr 1fr" gap={4}>
                    <FormControl isRequired>
                      <FormLabel>Alert Type</FormLabel>
                      <Select
                        value={alertType}
                        onChange={(e) => setAlertType(e.target.value)}
                      >
                        <option value="AirQuality">Air Quality</option>
                        <option value="Traffic">Traffic</option>
                        <option value="WaterLevel">Water Level</option>
                        <option value="Energy">Energy</option>
                        <option value="General">General</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Target City</FormLabel>
                      <Select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      >
                        {indianCities.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <FormControl isRequired>
                    <FormLabel>Alert Message</FormLabel>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter alert message"
                      rows={4}
                    />
                  </FormControl>
                  
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={loading}
                    alignSelf="flex-end"
                    mt={2}
                  >
                    Send Alert
                  </Button>
                </VStack>
              </form>
            </Box>
          </TabPanel>
          
          {/* Manage Alerts Tab */}
          <TabPanel>
            <Box bg="white" p={4} borderRadius="md" shadow="sm" overflowX="auto">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Manage Alerts</Heading>
                <Button 
                  leftIcon={<RepeatIcon />} 
                  size="sm" 
                  onClick={fetchAlerts}
                >
                  Refresh
                </Button>
              </Flex>
              
              {alerts.length === 0 ? (
                <Text color="gray.500" py={4} textAlign="center">No alerts to display</Text>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Type</Th>
                      <Th>Message</Th>
                      <Th>City</Th>
                      <Th>Timestamp</Th>
                      <Th>Sent To</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {alerts.map(alert => (
                      <Tr key={alert._id}>
                        <Td>
                          <Badge colorScheme={getAlertColor(alert.type)}>
                            {alert.type}
                          </Badge>
                        </Td>
                        <Td maxW="300px" isTruncated>{alert.message}</Td>
                        <Td>{alert.city || 'All Cities'}</Td>
                        <Td>{new Date(alert.timestamp).toLocaleString()}</Td>
                        <Td>{alert.sentToUsers}</Td>
                        <Td>
                          <IconButton
                            aria-label="Delete alert"
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDeleteAlert(alert._id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </TabPanel>
          
          {/* Users Tab */}
          <TabPanel>
            <Box bg="white" p={4} borderRadius="md" shadow="sm" overflowX="auto">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">User Management</Heading>
                <Button 
                  leftIcon={<RepeatIcon />} 
                  size="sm" 
                  onClick={fetchUsers}
                >
                  Refresh
                </Button>
              </Flex>
              
              {users.length === 0 ? (
                <Text color="gray.500" py={4} textAlign="center">No users to display</Text>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>City</Th>
                      <Th>Role</Th>
                      <Th>Joined</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map(user => (
                      <Tr key={user._id}>
                        <Td>{user.name}</Td>
                        <Td>{user.email}</Td>
                        <Td>{user.city}</Td>
                        <Td>
                          <Badge colorScheme={user.role === 'admin' ? 'purple' : 'green'}>
                            {user.role}
                          </Badge>
                        </Td>
                        <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminPanel; 