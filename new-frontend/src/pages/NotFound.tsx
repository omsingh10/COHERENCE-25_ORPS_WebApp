import React from 'react';
import { Box, Heading, Text, Button, Flex, useColorModeValue, Image } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NotFound = () => {
  const { user } = useAuth();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Determine the best redirect based on user role
  const homePath = user 
    ? (user.role === 'admin' ? '/admin' : '/dashboard')
    : '/login';
  
  return (
    <Flex 
      minHeight="100vh" 
      width="full" 
      align="center" 
      justifyContent="center"
      bg={bgColor}
    >
      <Box 
        p={8} 
        maxWidth="500px" 
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg" 
        textAlign="center"
        bg={cardBg}
        borderColor={borderColor}
      >
        <Heading as="h1" size="4xl" color={textColor} mb={4}>
          404
        </Heading>
        
        <Text fontSize="xl" fontWeight="bold" mb={2} color={textColor}>
          Page Not Found
        </Text>
        
        <Text mb={8} color={subtitleColor}>
          The page you're looking for doesn't exist or has been moved.
        </Text>
        
        <Flex direction="column" spacing={4} align="center">
          <Button
            as={RouterLink}
            to={homePath}
            colorScheme="blue"
            size="lg"
            mb={4}
            width="full"
          >
            Go to Homepage
          </Button>
          
          <Button
            as={RouterLink}
            to="/dashboard"
            variant="outline"
            width="full"
          >
            Back to Dashboard
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default NotFound; 