import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box, ColorModeScript } from '@chakra-ui/react';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Import custom themes
import AdminTheme from './theme/AdminTheme';
import UserTheme from './theme/UserTheme';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics';
import CityMap from './pages/CityMap';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import UserDashboard from './pages/UserDashboard';
import NotFound from './pages/NotFound';

// Theme Provider wrapper that selects the right theme based on user role
const ThemeSelector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Select theme based on user role
  const theme = useMemo(() => {
    return user?.role === 'admin' ? AdminTheme : UserTheme;
  }, [user?.role]);
  
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {children}
    </ChakraProvider>
  );
};

// Layout component for authenticated pages
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box minH="100vh">
      <Navbar />
      <Box pt="60px">{children}</Box>
    </Box>
  );
};

// Dashboard Redirect based on user role
const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return <Navigate to="/user-dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <ThemeSelector>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes with navbar */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <Dashboard />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <Analytics />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/city-map" 
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <CityMap />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/alerts" 
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <Alerts />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Role-specific routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AuthenticatedLayout>
                      <AdminPanel />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user-dashboard" 
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <UserDashboard />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Feature Pages */}
              <Route 
                path="/reports" 
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <Reports />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <AuthenticatedLayout>
                      <Settings />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Not found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeSelector>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
