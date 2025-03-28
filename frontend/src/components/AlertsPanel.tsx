import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Badge,
  Flex,
  Button,
  useToast,
  Collapse,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

interface Alert {
  _id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface AlertsPanelProps {
  city?: string;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ city }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user, city]);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/alerts/user/${user?.id}`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/alerts/${alertId}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark alert as read');
      }
      
      // Update local state
      setAlerts(alerts.map(alert => 
        alert._id === alertId ? { ...alert, read: true } : alert
      ));
      
      toast({
        title: 'Alert marked as read',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error marking alert as read:', error);
      toast({
        title: 'Failed to update alert',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/alerts/user/${user?.id}/read-all`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all alerts as read');
      }
      
      // Update local state
      setAlerts(alerts.map(alert => ({ ...alert, read: true })));
      
      toast({
        title: 'All alerts marked as read',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
      toast({
        title: 'Failed to update alerts',
        status: 'error',
        duration: 2000,
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

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <Box 
      bg="white" 
      borderRadius="lg" 
      boxShadow="sm" 
      p={4} 
      mb={6}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="md" display="flex" alignItems="center">
          Alerts & Notifications
          {unreadCount > 0 && (
            <Badge ml={2} colorScheme="red" borderRadius="full" px={2}>
              {unreadCount}
            </Badge>
          )}
        </Heading>
        <Flex>
          {alerts.length > 0 && (
            <Button 
              size="sm" 
              colorScheme="blue" 
              variant="outline" 
              mr={2}
              onClick={markAllAsRead}
              leftIcon={<CheckIcon />}
            >
              Mark All Read
            </Button>
          )}
          <IconButton
            aria-label={isOpen ? "Collapse alerts" : "Expand alerts"}
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            size="sm"
          />
        </Flex>
      </Flex>
      
      <Collapse in={isOpen} animateOpacity>
        {alerts.length === 0 ? (
          <Text color="gray.500" py={4} textAlign="center">
            No alerts at this time
          </Text>
        ) : (
          <VStack spacing={2} align="stretch" mt={2} maxH="300px" overflowY="auto">
            {alerts.map((alert, index) => (
              <React.Fragment key={alert._id}>
                {index > 0 && <Divider />}
                <Box
                  p={3}
                  borderRadius="md"
                  bg={alert.read ? "gray.50" : "blue.50"}
                  _hover={{ bg: alert.read ? "gray.100" : "blue.100" }}
                  transition="background 0.2s"
                >
                  <Flex justify="space-between" align="flex-start">
                    <Box>
                      <Flex align="center">
                        <Badge colorScheme={getAlertColor(alert.type)} mr={2}>
                          {alert.type}
                        </Badge>
                        <Text fontWeight={alert.read ? "normal" : "bold"}>
                          {alert.message}
                        </Text>
                      </Flex>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </Text>
                    </Box>
                    {!alert.read && (
                      <Button
                        size="xs"
                        leftIcon={<CheckIcon />}
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => markAsRead(alert._id)}
                      >
                        Mark Read
                      </Button>
                    )}
                  </Flex>
                </Box>
              </React.Fragment>
            ))}
          </VStack>
        )}
      </Collapse>
    </Box>
  );
};

export default AlertsPanel; 