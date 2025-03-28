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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FiHome, FiPieChart, FiMap, FiAlertCircle, FiSettings, FiDownload, FiFilter, FiSearch, FiChevronDown, FiEye, FiFileText, FiShare2, FiPrinter, FiBarChart2 } from 'react-icons/fi';
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
        <SidebarItem icon={<FiFileText size={18} />} to="/reports" isActive>Reports</SidebarItem>
        <SidebarItem icon={<FiSettings size={18} />} to="/settings">Settings</SidebarItem>
      </VStack>
    </Box>
  );
};

// Mock data for reports
const mockReports = [
  {
    id: 1,
    title: 'Monthly Air Quality Analysis',
    city: 'Mumbai',
    category: 'Environment',
    date: '2025-03-25',
    author: 'Environment Department',
    status: 'published',
    summary: 'Detailed analysis of air quality trends over the past month with recommendations for improvement.',
  },
  {
    id: 2,
    title: 'Traffic Congestion Quarterly Report',
    city: 'Delhi',
    category: 'Transportation',
    date: '2025-03-20',
    author: 'Transport Authority',
    status: 'published',
    summary: 'Analysis of traffic patterns and congestion hotspots with proposed solutions.',
  },
  {
    id: 3,
    title: 'Water Resource Management',
    city: 'Chennai',
    category: 'Water',
    date: '2025-03-15',
    author: 'Water Resources Department',
    status: 'published',
    summary: 'Status of water resources, conservation efforts, and recommendations for sustainable usage.',
  },
  {
    id: 4,
    title: 'Smart Street Lighting Implementation',
    city: 'Bangalore',
    category: 'Infrastructure',
    date: '2025-03-10',
    author: 'Smart City Initiative',
    status: 'draft',
    summary: 'Progress report on the implementation of smart street lighting system across the city.',
  },
  {
    id: 5,
    title: 'Urban Green Space Development',
    city: 'Hyderabad',
    category: 'Environment',
    date: '2025-03-05',
    author: 'Parks & Recreation',
    status: 'published',
    summary: 'Overview of new parks and green spaces developed in the last quarter.',
  },
  {
    id: 6,
    title: 'Public Transportation Usage Statistics',
    city: 'Mumbai',
    category: 'Transportation',
    date: '2025-02-28',
    author: 'Transport Authority',
    status: 'published',
    summary: 'Analysis of public transport usage, peak times, and user satisfaction metrics.',
  },
  {
    id: 7,
    title: 'Energy Consumption in Commercial Districts',
    city: 'Delhi',
    category: 'Energy',
    date: '2025-02-20',
    author: 'Energy Department',
    status: 'draft',
    summary: 'Study of energy usage patterns in commercial areas with recommendations for optimization.',
  },
  {
    id: 8,
    title: 'Waste Management System Evaluation',
    city: 'Bangalore',
    category: 'Waste',
    date: '2025-02-15',
    author: 'Sanitation Department',
    status: 'published',
    summary: 'Assessment of current waste management practices and future improvements.',
  },
];

// Report summary card
const ReportSummaryCard = ({ report, onView }: { report: any, onView: (report: any) => void }) => {
  const statusColor = report.status === 'published' ? 'green' : 'orange';
  
  return (
    <Card borderRadius="lg" boxShadow="sm" mb={4}>
      <CardBody>
        <Flex justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Heading size="md" mb={2}>{report.title}</Heading>
            <HStack mb={2}>
              <Badge colorScheme="blue">{report.city}</Badge>
              <Badge colorScheme="purple">{report.category}</Badge>
              <Badge colorScheme={statusColor}>{report.status}</Badge>
            </HStack>
            <Text color="gray.600" mb={4}>{report.summary}</Text>
            <HStack fontSize="sm" color="gray.500">
              <Text>Author: {report.author}</Text>
              <Text>•</Text>
              <Text>Date: {new Date(report.date).toLocaleDateString()}</Text>
            </HStack>
          </Box>
          <Button
            colorScheme="blue"
            size="sm"
            leftIcon={<FiEye />}
            onClick={() => onView(report)}
          >
            View
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

// City Stats Card
const CityStatsCard = ({ city, stats }: { city: string, stats: any }) => {
  return (
    <Card borderRadius="lg" boxShadow="sm" mb={4}>
      <CardHeader pb={0}>
        <Heading size="md">{city} Stats Overview</Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          {stats.map((stat: any, index: number) => (
            <Stat key={index}>
              <StatLabel>{stat.name}</StatLabel>
              <StatNumber>{stat.value}{stat.unit}</StatNumber>
              <StatHelpText>
                <StatArrow type={stat.trend >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(stat.trend)}% from previous period
              </StatHelpText>
            </Stat>
          ))}
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

// Mock city stats
const cityStats = {
  'Mumbai': [
    { name: 'Air Quality Index', value: 72, unit: '', trend: 5.3 },
    { name: 'Traffic Density', value: 425, unit: ' cars/h', trend: -2.1 },
    { name: 'Water Levels', value: 68, unit: '%', trend: 8.4 },
    { name: 'Energy Usage', value: 156, unit: ' kWh', trend: -12.3 },
  ],
  'Delhi': [
    { name: 'Air Quality Index', value: 156, unit: '', trend: 12.7 },
    { name: 'Traffic Density', value: 512, unit: ' cars/h', trend: 3.1 },
    { name: 'Water Levels', value: 45, unit: '%', trend: -5.4 },
    { name: 'Energy Usage', value: 189, unit: ' kWh', trend: 8.3 },
  ],
  'Bangalore': [
    { name: 'Air Quality Index', value: 63, unit: '', trend: -8.3 },
    { name: 'Traffic Density', value: 481, unit: ' cars/h', trend: 7.1 },
    { name: 'Water Levels', value: 72, unit: '%', trend: 2.4 },
    { name: 'Energy Usage', value: 142, unit: ' kWh', trend: -5.3 },
  ],
  'Chennai': [
    { name: 'Air Quality Index', value: 58, unit: '', trend: -3.3 },
    { name: 'Traffic Density', value: 352, unit: ' cars/h', trend: -5.1 },
    { name: 'Water Levels', value: 28, unit: '%', trend: -12.4 },
    { name: 'Energy Usage', value: 168, unit: ' kWh', trend: 2.3 },
  ],
  'Hyderabad': [
    { name: 'Air Quality Index', value: 67, unit: '', trend: 2.3 },
    { name: 'Traffic Density', value: 395, unit: ' cars/h', trend: -1.1 },
    { name: 'Water Levels', value: 62, unit: '%', trend: 3.4 },
    { name: 'Energy Usage', value: 152, unit: ' kWh', trend: -3.3 },
  ],
};

const Reports = () => {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState(user?.city || 'All Cities');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  
  // View report handler
  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    onOpen();
  };
  
  // Filter the reports
  const filteredReports = mockReports.filter(report => {
    // Filter by city
    if (selectedCity !== 'All Cities' && report.city !== selectedCity) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'All Categories' && report.category !== selectedCategory) {
      return false;
    }
    
    // Filter by status
    if (activeTab === 'published' && report.status !== 'published') {
      return false;
    }
    if (activeTab === 'draft' && report.status !== 'draft') {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !report.summary.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Get unique categories
  const categories = ['All Categories', ...Array.from(new Set(mockReports.map(report => report.category)))];
  
  // Get unique cities
  const cities = ['All Cities', ...Array.from(new Set(mockReports.map(report => report.city)))];
  
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
            <Heading as="h1" size="lg">City Reports</Heading>
            <Text color="gray.600">View and analyze detailed reports from cities across India</Text>
          </Box>
          
          <HStack spacing={3}>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="blue"
              variant="outline"
            >
              Export
            </Button>
            <Menu>
              <MenuButton as={Button} rightIcon={<FiChevronDown />} colorScheme="blue">
                Generate Report
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiBarChart2 />}>Air Quality Report</MenuItem>
                <MenuItem icon={<FiBarChart2 />}>Traffic Analysis</MenuItem>
                <MenuItem icon={<FiBarChart2 />}>Water Consumption</MenuItem>
                <MenuItem icon={<FiBarChart2 />}>Energy Usage Report</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        
        {/* Filters */}
        <Card borderRadius="lg" boxShadow="sm" mb={6}>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.300" />
                </InputLeftElement>
                <Input 
                  placeholder="Search reports..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              
              <Select 
                placeholder="Select a city" 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                isDisabled={!!user?.city}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </Select>
              
              <Select 
                placeholder="Select a category" 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </SimpleGrid>
          </CardBody>
        </Card>
        
        {/* City Stats if a specific city is selected */}
        {selectedCity !== 'All Cities' && cityStats[selectedCity as keyof typeof cityStats] && (
          <CityStatsCard 
            city={selectedCity} 
            stats={cityStats[selectedCity as keyof typeof cityStats]} 
          />
        )}
        
        {/* Reports Tabs */}
        <Card borderRadius="lg" boxShadow="sm">
          <Tabs colorScheme="blue" onChange={(index) => setActiveTab(['all', 'published', 'draft'][index])} defaultIndex={0}>
            <TabList px={4} pt={4}>
              <Tab>All Reports</Tab>
              <Tab>Published</Tab>
              <Tab>Drafts</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                {filteredReports.length === 0 ? (
                  <Box textAlign="center" py={10}>
                    <Icon as={FiFileText} w={10} h={10} color="gray.400" />
                    <Text mt={4} color="gray.500">No reports found matching your criteria</Text>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {filteredReports.map(report => (
                      <ReportSummaryCard key={report.id} report={report} onView={handleViewReport} />
                    ))}
                  </VStack>
                )}
              </TabPanel>
              
              <TabPanel>
                {filteredReports.length === 0 ? (
                  <Box textAlign="center" py={10}>
                    <Icon as={FiFileText} w={10} h={10} color="gray.400" />
                    <Text mt={4} color="gray.500">No published reports found matching your criteria</Text>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {filteredReports.map(report => (
                      <ReportSummaryCard key={report.id} report={report} onView={handleViewReport} />
                    ))}
                  </VStack>
                )}
              </TabPanel>
              
              <TabPanel>
                {filteredReports.length === 0 ? (
                  <Box textAlign="center" py={10}>
                    <Icon as={FiFileText} w={10} h={10} color="gray.400" />
                    <Text mt={4} color="gray.500">No draft reports found matching your criteria</Text>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {filteredReports.map(report => (
                      <ReportSummaryCard key={report.id} report={report} onView={handleViewReport} />
                    ))}
                  </VStack>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
        
        {/* Report View Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="lg">
            <ModalHeader>
              {selectedReport?.title}
              <HStack mt={2}>
                <Badge colorScheme="blue">{selectedReport?.city}</Badge>
                <Badge colorScheme="purple">{selectedReport?.category}</Badge>
                <Badge colorScheme={selectedReport?.status === 'published' ? 'green' : 'orange'}>
                  {selectedReport?.status}
                </Badge>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontWeight="bold" mb={2}>Summary:</Text>
              <Text mb={4}>{selectedReport?.summary}</Text>
              
              <Text fontWeight="bold" mb={2}>Detailed Findings:</Text>
              <Text mb={4}>
                This detailed report presents comprehensive analysis and trends observed in {selectedReport?.city} 
                regarding {selectedReport?.category.toLowerCase()} metrics. The data collected shows significant 
                patterns that can inform policy decisions and improvement initiatives.
              </Text>
              
              <Text mb={4}>
                Based on our analysis, we recommend the following actions to address the issues highlighted in this report:
              </Text>
              
              <VStack align="stretch" spacing={2} pl={4} mb={4}>
                <Text>• Implementation of more stringent monitoring systems</Text>
                <Text>• Public awareness campaigns to promote community participation</Text>
                <Text>• Infrastructure upgrades in key areas of the city</Text>
                <Text>• Collaboration with relevant stakeholders for sustainable solutions</Text>
              </VStack>
              
              <Text fontWeight="bold" mb={2}>Additional Information:</Text>
              <HStack fontSize="sm" color="gray.600" mb={4}>
                <Text>Author: {selectedReport?.author}</Text>
                <Text>•</Text>
                <Text>Date: {selectedReport && new Date(selectedReport.date).toLocaleDateString()}</Text>
              </HStack>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={3}>
                <Button leftIcon={<FiShare2 />} variant="outline">Share</Button>
                <Button leftIcon={<FiPrinter />} variant="outline">Print</Button>
                <Button leftIcon={<FiDownload />} colorScheme="blue">Download</Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default Reports; 