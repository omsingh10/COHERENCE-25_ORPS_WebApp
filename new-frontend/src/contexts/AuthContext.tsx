import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  city?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Check for specific credentials first
      if (email === 'admin@smartcity.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@smartcity.com',
          role: 'admin'
        };
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        return true;
      }
      
      if (email === 'user1@smartcity.com' && password === 'user123') {
        const regularUser: User = {
          id: 'user-1',
          name: 'Regular User',
          email: 'user1@smartcity.com',
          role: 'user',
          city: 'Mumbai'
        };
        localStorage.setItem('user', JSON.stringify(regularUser));
        setUser(regularUser);
        return true;
      }

      // Mock login for any other credentials - in a real app, this would call an API
      // For demo purposes, accept any email/password with basic validation
      if (!email || !password) {
        return false;
      }

      // Auto-assign role based on email content
      const isAdmin = email.includes('admin');
      let city = 'Mumbai'; // Default city
      
      // Assign different city based on email for demo
      if (email.includes('delhi')) city = 'Delhi';
      if (email.includes('bangalore')) city = 'Bangalore';
      if (email.includes('chennai')) city = 'Chennai';
      if (email.includes('hyderabad')) city = 'Hyderabad';
      
      // For admin, don't restrict to a single city
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9), // Generate random ID
        name: email.split('@')[0].replace(/[.0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Convert email to name
        email,
        role: isAdmin ? 'admin' : 'user',
        city: isAdmin ? undefined : city // Admins can see all cities
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Mock registration - in a real app, this would call an API
      if (!name || !email || !password) {
        return false;
      }

      // Determine if admin based on email (for demo)
      const isAdmin = email.includes('admin');
      
      // Default city is Mumbai unless specified in email
      let city = 'Mumbai';
      if (email.includes('delhi')) city = 'Delhi';
      if (email.includes('bangalore')) city = 'Bangalore';
      if (email.includes('chennai')) city = 'Chennai';
      if (email.includes('hyderabad')) city = 'Hyderabad';

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: isAdmin ? 'admin' : 'user',
        city: isAdmin ? undefined : city
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 