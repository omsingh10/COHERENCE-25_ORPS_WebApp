import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorMode } from '@chakra-ui/react';

interface ThemeContextType {
  isDark: boolean;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleColorMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDark, setIsDark] = useState(colorMode === 'dark');

  // Update isDark when colorMode changes
  useEffect(() => {
    setIsDark(colorMode === 'dark');
  }, [colorMode]);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('chakra-ui-color-mode');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // If no saved preference, set based on system
    if (!savedMode && prefersDark && colorMode !== 'dark') {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 