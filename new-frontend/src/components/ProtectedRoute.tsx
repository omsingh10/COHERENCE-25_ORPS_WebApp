import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const spinnerColor = useColorModeValue('blue.500', 'blue.300');
  const bgColor = useColorModeValue('white', 'gray.800');

  // Show loading spinner while auth state is being checked
  if (loading) {
    return (
      <Flex 
        height="100vh" 
        width="100%" 
        alignItems="center" 
        justifyContent="center"
        bg={bgColor}
      >
        <Box textAlign="center">
          <Spinner 
            size="xl" 
            thickness="4px" 
            speed="0.65s" 
            color={spinnerColor} 
            mb={4} 
          />
          <Text>Loading...</Text>
        </Box>
      </Flex>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check for role-based access
  if (requiredRole && user.role !== requiredRole) {
    // If admin role required but user is not admin
    if (requiredRole === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // If user role required but user is admin, send to admin dashboard
    if (requiredRole === 'user' && user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  // If authorized, render the children
  return <>{children}</>;
};

export default ProtectedRoute; 