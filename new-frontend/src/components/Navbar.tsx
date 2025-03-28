import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Stack, 
  useColorModeValue, 
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Badge
} from '@chakra-ui/react';
import { HamburgerIcon, BellIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  
  // Determine appropriate dashboard link based on user role
  const dashboardLink = user?.role === 'admin' ? '/admin' : '/user-dashboard';
  
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
        justify={'space-between'}
      >
        <Flex>
          <Text
            fontFamily={'heading'}
            fontWeight="bold"
            fontSize="xl"
            color={useColorModeValue('blue.600', 'white')}
            as={RouterLink}
            to="/"
          >
            OPRS Dashboard
            {user?.role === 'admin' && (
              <Badge ml={2} colorScheme="purple">Admin</Badge>
            )}
          </Text>
        </Flex>

        {/* Desktop Navigation */}
        <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          {isAuthenticated && (
            <>
              <RouterLink to={dashboardLink}>
                <Text 
                  color={isActive(dashboardLink) || isActive('/dashboard') ? 'blue.500' : 'gray.500'} 
                  fontWeight={isActive(dashboardLink) || isActive('/dashboard') ? 'bold' : 'normal'}
                >
                  Dashboard
                </Text>
              </RouterLink>
              
              {user?.role === 'admin' ? (
                <>
                  <RouterLink to="/admin/alerts">
                    <Text color={isActive('/admin/alerts') ? 'blue.500' : 'gray.500'} fontWeight={isActive('/admin/alerts') ? 'bold' : 'normal'}>
                      Manage Alerts
                    </Text>
                  </RouterLink>
                  <RouterLink to="/admin/users">
                    <Text color={isActive('/admin/users') ? 'blue.500' : 'gray.500'} fontWeight={isActive('/admin/users') ? 'bold' : 'normal'}>
                      Users
                    </Text>
                  </RouterLink>
                </>
              ) : (
                <>
                  <RouterLink to="/analytics">
                    <Text color={isActive('/analytics') ? 'blue.500' : 'gray.500'} fontWeight={isActive('/analytics') ? 'bold' : 'normal'}>
                      Analytics
                    </Text>
                  </RouterLink>
                  <RouterLink to="/alerts">
                    <Text color={isActive('/alerts') ? 'blue.500' : 'gray.500'} fontWeight={isActive('/alerts') ? 'bold' : 'normal'}>
                      Alerts
                    </Text>
                  </RouterLink>
                </>
              )}
            </>
          )}
        </HStack>

        <Stack direction={'row'} spacing={4}>
          {isAuthenticated ? (
            <Stack direction="row" spacing={2} align="center">
              {/* Notifications */}
              <IconButton
                icon={<BellIcon />}
                variant="ghost"
                aria-label="Notifications"
                position="relative"
              >
                <Badge position="absolute" top="-5px" right="-5px" colorScheme="red" borderRadius="full">
                  3
                </Badge>
              </IconButton>
              
              <Menu>
                <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
                  <Avatar 
                    size={'sm'} 
                    name={user?.name || 'User'} 
                    bg={user?.role === 'admin' ? 'purple.500' : 'blue.500'} 
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                  <MenuItem as={RouterLink} to="/settings">Settings</MenuItem>
                  {user?.role === 'admin' && (
                    <MenuItem as={RouterLink} to="/admin">Admin Panel</MenuItem>
                  )}
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          ) : (
            <Stack direction={'row'} spacing={4}>
              <Button as={RouterLink} to="/login" variant={'ghost'}>
                Sign In
              </Button>
              <Button as={RouterLink} to="/register" colorScheme={'blue'}>
                Sign Up
              </Button>
            </Stack>
          )}

          {/* Mobile menu button */}
          <IconButton
            icon={<HamburgerIcon />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
          />
        </Stack>
      </Flex>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              {isAuthenticated ? (
                <>
                  <Text as={RouterLink} to={dashboardLink} onClick={onClose} fontWeight="semibold">
                    Dashboard
                  </Text>
                  
                  {user?.role === 'admin' ? (
                    <>
                      <Text as={RouterLink} to="/admin/alerts" onClick={onClose}>
                        Manage Alerts
                      </Text>
                      <Text as={RouterLink} to="/admin/users" onClick={onClose}>
                        Users
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text as={RouterLink} to="/analytics" onClick={onClose}>
                        Analytics
                      </Text>
                      <Text as={RouterLink} to="/alerts" onClick={onClose}>
                        Alerts
                      </Text>
                    </>
                  )}
                  
                  <Text as={RouterLink} to="/profile" onClick={onClose}>
                    Profile
                  </Text>
                  <Text as={RouterLink} to="/settings" onClick={onClose}>
                    Settings
                  </Text>
                  <Button colorScheme="red" variant="ghost" onClick={() => {
                    handleLogout();
                    onClose();
                  }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button as={RouterLink} to="/login" onClick={onClose} variant="ghost" w="full">
                    Sign In
                  </Button>
                  <Button as={RouterLink} to="/register" onClick={onClose} colorScheme="blue" w="full">
                    Sign Up
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar; 