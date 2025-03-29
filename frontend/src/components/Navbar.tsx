import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  useColorModeValue,
  useDisclosure,
  useColorMode,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  VStack,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
} from '@chakra-ui/icons';
import { FiHome, FiBarChart2, FiMap, FiBell, FiUser, FiSettings } from 'react-icons/fi';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        align={'center'}
        justifyContent="space-between"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={{ base: 'center', md: 'left' }}
            fontFamily={'heading'}
            fontWeight="bold"
            color={useColorModeValue('gray.800', 'white')}
            as={RouterLink}
            to="/"
          >
            SmartCity
          </Text>
        </Flex>

        <HStack spacing={3}>
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
          
          {isAuthenticated && (
            <IconButton
              aria-label="Notifications"
              icon={<BellIcon />}
              variant="ghost"
              position="relative"
            />
          )}
          
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  name={user?.name}
                />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                {user?.role === 'admin' && (
                  <MenuItem as={RouterLink} to="/admin">Admin Dashboard</MenuItem>
                )}
                <MenuItem as={RouterLink} to="/settings">Settings</MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Stack direction="row" spacing={4}>
              <Button
                as={RouterLink}
                to="/login"
                fontSize="sm"
                fontWeight={400}
                variant="link"
              >
                Login
              </Button>
              <Button
            <Button as={RouterLink} to="/login" colorScheme="blue">
              Sign In
            </Button>
          )}
        </HStack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
      
      {user && (
        <Flex>
          <VStack
            as="nav"
            pos="fixed"
            top="60px"
            left="0"
            width="200px"
            bg={useColorModeValue('white', 'gray.800')}
            borderRight="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            h="calc(100vh - 60px)"
            p={4}
            spacing={4}
            align="stretch"
            display={{ base: 'none', md: 'flex' }}
          >
            <NavItem 
              icon={<FiHome />} 
              to="/" 
              isActive={isActive('/')}
            >
              Dashboard
            </NavItem>
            <NavItem 
              icon={<FiBarChart2 />} 
              to="/analytics" 
              isActive={isActive('/analytics')}
            >
              Analytics
            </NavItem>
            <NavItem 
              icon={<FiMap />} 
              to="/map-view" 
              isActive={isActive('/map-view')}
            >
              Map View
            </NavItem>
            <NavItem 
              icon={<FiBell />} 
              to="/alerts" 
              isActive={isActive('/alerts')}
            >
              Alerts
            </NavItem>
            {user.role === 'admin' && (
              <NavItem 
                icon={<FiUser />} 
                to="/user-reports" 
                isActive={isActive('/user-reports')}
              >
                User Reports
              </NavItem>
            )}
            <NavItem 
              icon={<FiSettings />} 
              to="/settings" 
              isActive={isActive('/settings')}
            >
              Settings
            </NavItem>
          </VStack>
          
          <Box ml={{ base: 0, md: '200px' }} width="calc(100% - 200px)" display={{ base: 'none', md: 'block' }} />
        </Flex>
      )}
    </Box>
  );
};

interface NavItemProps {
  icon: React.ReactElement;
  children: React.ReactNode;
  to: string;
  isActive: boolean;
}

const NavItem = ({ icon, children, to, isActive }: NavItemProps) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="2"
        borderRadius="md"
        role="group"
        cursor="pointer"
        bg={isActive ? 'blue.500' : 'transparent'}
        color={isActive ? 'white' : 'inherit'}
        _hover={{
          bg: isActive ? 'blue.600' : 'blue.50',
          color: isActive ? 'white' : 'blue.500',
        }}
      >
        {icon && (
          <Icon
            mr="3"
            fontSize="16"
            as={icon.type}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      <MobileNavItem label="Dashboard" href="/" />
      <MobileNavItem label="Analytics" href="/analytics" />
      <MobileNavItem label="Map View" href="/map-view" />
      <MobileNavItem label="Alerts" href="/alerts" />
      <MobileNavItem label="Settings" href="/settings" />
    </Stack>
  );
};

interface MobileNavItemProps {
  label: string;
  href: string;
}

const MobileNavItem = ({ label, href }: MobileNavItemProps) => {
  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={RouterLink}
        to={href}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
      </Flex>
    </Stack>
  );
};

export default Navbar; 