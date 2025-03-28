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
  FormControl,
  FormLabel,
  Input,
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Avatar,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { FiHome, FiPieChart, FiMap, FiAlertCircle, FiSettings, FiUser, FiBell, FiLock, FiEdit } from 'react-icons/fi';
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
        <SidebarItem icon={<FiAlertCircle size={18} />} to="/alerts">Alerts</SidebarItem>
        <SidebarItem icon={<FiSettings size={18} />} to="/settings" isActive>Settings</SidebarItem>
      </VStack>
    </Box>
  );
};

const Settings = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [selectedCity, setSelectedCity] = useState(user?.city || 'Mumbai');
  
  // Form states
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || 'User');
  const [phone, setPhone] = useState('9876543210');
  const [department, setDepartment] = useState('Urban Planning');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataRefresh, setDataRefresh] = useState('5');
  const [isEditing, setIsEditing] = useState(false);
  
  // Handle save profile
  const handleSaveProfile = () => {
    toast({
      title: 'Profile updated',
      description: 'Your profile settings have been saved successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setIsEditing(false);
  };
  
  // Handle save notifications
  const handleSaveNotifications = () => {
    toast({
      title: 'Notification settings updated',
      description: 'Your notification preferences have been saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Handle save display
  const handleSaveDisplay = () => {
    toast({
      title: 'Display settings updated',
      description: 'Your display preferences have been saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
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
            <Heading as="h1" size="lg">Settings</Heading>
            <Text color="gray.600">Manage your account preferences</Text>
          </Box>
        </Flex>
        
        {/* Settings Tabs */}
        <Card borderRadius="lg" boxShadow="sm">
          <Tabs colorScheme="blue" isFitted variant="enclosed">
            <TabList>
              <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>
                <HStack>
                  <FiUser />
                  <Text>Profile</Text>
                </HStack>
              </Tab>
              <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>
                <HStack>
                  <FiBell />
                  <Text>Notifications</Text>
                </HStack>
              </Tab>
              <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>
                <HStack>
                  <FiSettings />
                  <Text>Display</Text>
                </HStack>
              </Tab>
              <Tab _selected={{ bg: 'white', borderBottomColor: 'white' }}>
                <HStack>
                  <FiLock />
                  <Text>Security</Text>
                </HStack>
              </Tab>
            </TabList>
            
            <TabPanels>
              {/* Profile Tab */}
              <TabPanel bg="white">
                <Flex mb={6} alignItems="center">
                  <Avatar size="xl" name={name} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`} mr={6} />
                  <Box flex="1">
                    <Heading size="md">{name}</Heading>
                    <Text color="gray.600">{email}</Text>
                    <Text color="gray.600">City: {selectedCity}</Text>
                    <Text color="gray.600">Role: {user?.role === 'admin' ? 'Administrator' : 'City User'}</Text>
                  </Box>
                  <Button
                    leftIcon={<FiEdit />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Flex>
                
                <Divider mb={6} />
                
                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        isReadOnly={!isEditing}
                        bg={isEditing ? 'white' : 'gray.50'}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isReadOnly={!isEditing}
                        bg={isEditing ? 'white' : 'gray.50'}
                      />
                    </FormControl>
                  </SimpleGrid>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        isReadOnly={!isEditing}
                        bg={isEditing ? 'white' : 'gray.50'}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Department</FormLabel>
                      <Input
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        isReadOnly={!isEditing}
                        bg={isEditing ? 'white' : 'gray.50'}
                      />
                    </FormControl>
                  </SimpleGrid>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>City</FormLabel>
                      <Select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        isDisabled={!isEditing || !!user?.city}
                      >
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Hyderabad">Hyderabad</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                  
                  {isEditing && (
                    <Button
                      colorScheme="blue"
                      onClick={handleSaveProfile}
                      alignSelf="flex-end"
                    >
                      Save Changes
                    </Button>
                  )}
                </VStack>
              </TabPanel>
              
              {/* Notifications Tab */}
              <TabPanel bg="white">
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Notification Preferences</Heading>
                  
                  <Box>
                    <FormControl display="flex" alignItems="center" mb={4}>
                      <FormLabel mb="0">
                        Email Notifications
                      </FormLabel>
                      <Switch
                        colorScheme="blue"
                        isChecked={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.checked)}
                      />
                    </FormControl>
                    <Text fontSize="sm" color="gray.500" ml="1">
                      Receive alerts and updates to your email address
                    </Text>
                  </Box>
                  
                  <Box>
                    <FormControl display="flex" alignItems="center" mb={4}>
                      <FormLabel mb="0">
                        SMS Notifications
                      </FormLabel>
                      <Switch
                        colorScheme="blue"
                        isChecked={notifySMS}
                        onChange={(e) => setNotifySMS(e.target.checked)}
                      />
                    </FormControl>
                    <Text fontSize="sm" color="gray.500" ml="1">
                      Receive critical alerts via SMS to your phone
                    </Text>
                  </Box>
                  
                  <Box>
                    <FormControl display="flex" alignItems="center" mb={4}>
                      <FormLabel mb="0">
                        Push Notifications
                      </FormLabel>
                      <Switch
                        colorScheme="blue"
                        isChecked={notifyPush}
                        onChange={(e) => setNotifyPush(e.target.checked)}
                      />
                    </FormControl>
                    <Text fontSize="sm" color="gray.500" ml="1">
                      Receive real-time notifications in your browser
                    </Text>
                  </Box>
                  
                  <Divider />
                  
                  <Heading size="md">Alert Types</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">
                        Air Quality Alerts
                      </FormLabel>
                      <Switch colorScheme="blue" defaultChecked />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">
                        Traffic Alerts
                      </FormLabel>
                      <Switch colorScheme="blue" defaultChecked />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">
                        Water Supply Alerts
                      </FormLabel>
                      <Switch colorScheme="blue" defaultChecked />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">
                        Energy Alerts
                      </FormLabel>
                      <Switch colorScheme="blue" defaultChecked />
                    </FormControl>
                  </SimpleGrid>
                  
                  <Button
                    colorScheme="blue"
                    onClick={handleSaveNotifications}
                    alignSelf="flex-end"
                  >
                    Save Notification Settings
                  </Button>
                </VStack>
              </TabPanel>
              
              {/* Display Tab */}
              <TabPanel bg="white">
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Display Settings</Heading>
                  
                  <Box>
                    <FormControl display="flex" alignItems="center" mb={4}>
                      <FormLabel mb="0">
                        Dark Mode
                      </FormLabel>
                      <Switch
                        colorScheme="blue"
                        isChecked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                      />
                    </FormControl>
                    <Text fontSize="sm" color="gray.500" ml="1">
                      Switch between light and dark themes
                    </Text>
                  </Box>
                  
                  <Box>
                    <FormControl mb={4}>
                      <FormLabel>Data Refresh Rate</FormLabel>
                      <Select
                        value={dataRefresh}
                        onChange={(e) => setDataRefresh(e.target.value)}
                      >
                        <option value="1">1 minute</option>
                        <option value="5">5 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                      </Select>
                    </FormControl>
                    <Text fontSize="sm" color="gray.500" ml="1">
                      How frequently to refresh dashboard data
                    </Text>
                  </Box>
                  
                  <Divider />
                  
                  <Heading size="md">Chart Preferences</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">
                        Show Grid Lines
                      </FormLabel>
                      <Switch colorScheme="blue" defaultChecked />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">
                        Show Data Labels
                      </FormLabel>
                      <Switch colorScheme="blue" defaultChecked />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">
                        Animation Effects
                      </FormLabel>
                      <Switch colorScheme="blue" defaultChecked />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel mb="0">
                        Auto-scale Charts
                      </FormLabel>
                      <Switch colorScheme="blue" defaultChecked />
                    </FormControl>
                  </SimpleGrid>
                  
                  <Button
                    colorScheme="blue"
                    onClick={handleSaveDisplay}
                    alignSelf="flex-end"
                  >
                    Save Display Settings
                  </Button>
                </VStack>
              </TabPanel>
              
              {/* Security Tab */}
              <TabPanel bg="white">
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Security Settings</Heading>
                  
                  <Box>
                    <Heading size="sm" mb={4}>Change Password</Heading>
                    
                    <SimpleGrid columns={1} spacing={4}>
                      <FormControl>
                        <FormLabel>Current Password</FormLabel>
                        <Input type="password" />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>New Password</FormLabel>
                        <Input type="password" />
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Confirm New Password</FormLabel>
                        <Input type="password" />
                      </FormControl>
                    </SimpleGrid>
                    
                    <Button mt={4} colorScheme="blue">
                      Update Password
                    </Button>
                  </Box>
                  
                  <Divider my={6} />
                  
                  <Box>
                    <Heading size="sm" mb={4}>Two-Factor Authentication</Heading>
                    
                    <FormControl display="flex" alignItems="center" mb={4}>
                      <FormLabel mb="0">
                        Enable 2FA
                      </FormLabel>
                      <Switch colorScheme="blue" />
                    </FormControl>
                    <Text fontSize="sm" color="gray.500" ml="1">
                      Secure your account with two-factor authentication
                    </Text>
                    
                    <Button mt={4} colorScheme="blue" variant="outline">
                      Set Up Two-Factor Authentication
                    </Button>
                  </Box>
                  
                  <Divider my={6} />
                  
                  <Box>
                    <Heading size="sm" mb={4}>Session Management</Heading>
                    <Text color="gray.600" mb={4}>
                      You are currently logged in from 1 device. You can log out from all devices except the current one.
                    </Text>
                    
                    <Button colorScheme="red" variant="outline">
                      Log Out From All Other Devices
                    </Button>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
      </Box>
    </Flex>
  );
};

export default Settings; 