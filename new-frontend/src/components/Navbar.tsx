import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  HStack,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiBell, FiUser, FiLogOut, FiHome, FiPieChart, FiMap, FiAlertCircle, FiSettings } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const { isDark, toggleColorMode } = useTheme();
  const location = useLocation();
  
  const isAdmin = user?.role === 'admin';

  // Base colors for all users
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const menuBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  
  // Role-specific colors
  const logoColor = useColorModeValue(
    isAdmin ? 'admin.500' : 'brand.500', 
    isAdmin ? 'admin.300' : 'brand.300'
  );
  const activeBg = useColorModeValue(
    isAdmin ? 'admin.50' : 'brand.50', 
    isAdmin ? 'admin.900' : 'brand.900'
  );
  const activeColor = useColorModeValue(
    isAdmin ? 'admin.600' : 'brand.600', 
    isAdmin ? 'admin.200' : 'brand.200'
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <ChakraLink
      as={Link}
      to={to}
      px={3}
      py={2}
      rounded="md"
      fontWeight={isActive(to) ? 'bold' : 'medium'}
      color={isActive(to) ? activeColor : textColor}
      bg={isActive(to) ? activeBg : 'transparent'}
      _hover={{
        textDecoration: 'none',
        bg: hoverBg,
      }}
    >
      {children}
    </ChakraLink>
  );

  const MobileNavLink = ({ to, icon, children, onClose }: { to: string; icon: React.ReactElement; children: React.ReactNode; onClose: () => void }) => (
    <Link to={to} onClick={onClose}>
      <Flex
        align="center"
        p="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive(to) ? activeBg : 'transparent'}
        color={isActive(to) ? activeColor : textColor}
        fontWeight={isActive(to) ? 'bold' : 'normal'}
        _hover={{
          bg: hoverBg,
        }}
      >
        {React.cloneElement(icon, { size: 18 })}
        <Text ml="4">{children}</Text>
      </Flex>
    </Link>
  );

  return (
    <Box>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        w="100%"
        px={4}
        py={2}
        bg={bg}
        color={textColor}
        borderBottom="1px"
        borderColor={borderColor}
        position="fixed"
        top={0}
        zIndex={1000}
        boxShadow="sm"
      >
        <HStack spacing={8}>
          <Flex align="center">
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={logoColor}
              display={{ base: 'none', md: 'block' }}
            >
              {isAdmin ? "OPRS Admin" : "OPRS Dashboard"}
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={logoColor}
              display={{ base: 'block', md: 'none' }}
            >
              {isAdmin ? "OPRS Admin" : "OPRS"}
            </Text>
          </Flex>

          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            {isAdmin ? (
              // Admin Navigation Links
              <>
                <NavLink to="/admin">Admin Dashboard</NavLink>
                <NavLink to="/analytics">Analytics</NavLink>
                <NavLink to="/city-map">City Map</NavLink>
                <NavLink to="/alerts">Alerts</NavLink>
              </>
            ) : (
              // User Navigation Links
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/analytics">Analytics</NavLink>
                <NavLink to="/city-map">City Map</NavLink>
                <NavLink to="/alerts">Alerts</NavLink>
              </>
            )}
          </HStack>
        </HStack>

        <Flex align="center">
          <IconButton
            icon={isDark ? <FiSun /> : <FiMoon />}
            aria-label="Toggle color mode"
            variant="ghost"
            onClick={toggleColorMode}
            mr={2}
            color={isAdmin && !isDark ? 'admin.500' : undefined}
          />
          
          <IconButton
            icon={<FiBell />}
            variant="ghost"
            aria-label="Notifications"
            mr={2}
            color={isAdmin && !isDark ? 'admin.500' : undefined}
          />

          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <Avatar 
                size="sm" 
                name={user?.name || 'User'} 
                bg={isAdmin ? (isDark ? 'admin.500' : 'admin.600') : (isDark ? 'brand.500' : 'brand.600')}
                color="white"
              />
            </MenuButton>
            <MenuList bg={menuBg}>
              <Box px={3} py={2}>
                <Text fontWeight="bold">{user?.name || 'Guest'}</Text>
                <Text fontSize="sm" opacity={0.8}>{user?.email || 'guest@example.com'}</Text>
                {user?.city && <Text fontSize="sm">City: {user.city}</Text>}
                {isAdmin && (
                  <Text fontSize="sm" color={activeColor} fontWeight="bold">
                    Admin Access
                  </Text>
                )}
              </Box>
              <MenuDivider />
              <MenuItem 
                icon={<FiUser size={16} />}
                _hover={{ bg: hoverBg }}
              >
                Profile
              </MenuItem>
              <MenuItem 
                icon={<FiSettings size={16} />}
                _hover={{ bg: hoverBg }}
                as={Link}
                to="/settings"
              >
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem 
                icon={<FiLogOut size={16} />}
                onClick={logout}
                _hover={{ bg: hoverBg }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>

          <IconButton
            display={{ base: 'flex', md: 'none' }}
            ml={2}
            icon={<FiMenu />}
            variant="ghost"
            aria-label="Open menu"
            onClick={onOpen}
            color={isAdmin && !isDark ? 'admin.500' : undefined}
          />
        </Flex>
      </Flex>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={bg} color={textColor}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
            <Text color={logoColor} fontWeight="bold">
              {isAdmin ? "OPRS Admin" : "OPRS Dashboard"}
            </Text>
          </DrawerHeader>
          <DrawerBody p={0}>
            {isAdmin ? (
              // Admin Mobile Navigation
              <>
                <MobileNavLink to="/admin" icon={<FiHome />} onClose={onClose}>Admin Dashboard</MobileNavLink>
                <MobileNavLink to="/analytics" icon={<FiPieChart />} onClose={onClose}>Analytics</MobileNavLink>
                <MobileNavLink to="/city-map" icon={<FiMap />} onClose={onClose}>City Map</MobileNavLink>
                <MobileNavLink to="/alerts" icon={<FiAlertCircle />} onClose={onClose}>Alerts</MobileNavLink>
                <MobileNavLink to="/settings" icon={<FiSettings />} onClose={onClose}>Settings</MobileNavLink>
              </>
            ) : (
              // User Mobile Navigation
              <>
                <MobileNavLink to="/dashboard" icon={<FiHome />} onClose={onClose}>Dashboard</MobileNavLink>
                <MobileNavLink to="/analytics" icon={<FiPieChart />} onClose={onClose}>Analytics</MobileNavLink>
                <MobileNavLink to="/city-map" icon={<FiMap />} onClose={onClose}>City Map</MobileNavLink>
                <MobileNavLink to="/alerts" icon={<FiAlertCircle />} onClose={onClose}>Alerts</MobileNavLink>
                <MobileNavLink to="/settings" icon={<FiSettings />} onClose={onClose}>Settings</MobileNavLink>
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar; 