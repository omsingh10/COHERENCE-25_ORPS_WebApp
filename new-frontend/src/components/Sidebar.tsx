import React from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  useColorModeValue,
  Icon,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  useDisclosure,
  CloseButton,
} from '@chakra-ui/react';
import { FiHome, FiPieChart, FiMap, FiAlertCircle, FiSettings, FiActivity, FiMenu } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// SidebarItem component
export const SidebarItem = ({ 
  icon, 
  to, 
  children, 
  isActive = false 
}: { 
  icon: React.ReactElement, 
  to: string, 
  children: React.ReactNode, 
  isActive?: boolean 
}) => {
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

// Sidebar content component (used by both desktop sidebar and mobile drawer)
const SidebarContent = ({ onClose = () => {}, ...rest }) => {
  const { user } = useAuth();
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };
  
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/user-dashboard';
  
  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
          SmartCity
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <VStack spacing={1} align="stretch" mt={5}>
        <SidebarItem 
          icon={<FiHome size={18} />} 
          to={dashboardPath} 
          isActive={isActive(dashboardPath) || isActive('/user-dashboard') || isActive('/admin')}
        >
          Dashboard
        </SidebarItem>
        <SidebarItem 
          icon={<FiPieChart size={18} />} 
          to="/analytics"
          isActive={isActive('/analytics')}
        >
          Analytics
        </SidebarItem>
        <SidebarItem 
          icon={<FiMap size={18} />} 
          to="/city-map"
          isActive={isActive('/city-map')}
        >
          City Map
        </SidebarItem>
        <SidebarItem 
          icon={<FiAlertCircle size={18} />} 
          to="/alerts"
          isActive={isActive('/alerts')}
        >
          Alerts
        </SidebarItem>
        <SidebarItem 
          icon={<FiActivity size={18} />} 
          to="/reports"
          isActive={isActive('/reports')}
        >
          Reports
        </SidebarItem>
        <SidebarItem 
          icon={<FiSettings size={18} />} 
          to="/settings"
          isActive={isActive('/settings')}
        >
          Settings
        </SidebarItem>
      </VStack>
    </Box>
  );
};

// MobileNav component for responsive design
const MobileNav = ({ onOpen, ...rest }) => {
  const { user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={bgColor}
      borderBottomWidth="1px"
      borderBottomColor={borderColor}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
        display={{ base: 'flex', md: 'none' }}
      />

      <Text fontSize="xl" ml="8" fontWeight="bold" color="blue.500" display={{ base: 'flex', md: 'none' }}>
        SmartCity
      </Text>
    </Flex>
  );
};

// Main Sidebar component
const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <Box>
      <SidebarContent display={{ base: 'none', md: 'block' }} />
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Sidebar; 