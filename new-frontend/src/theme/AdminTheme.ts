import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// Admin theme keeps the original dashboard styling
const AdminTheme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3', // Original blue shade
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
    admin: {
      50: '#f3e5f5',
      100: '#e1bee7',
      200: '#ce93d8',
      300: '#ba68c8',
      400: '#ab47bc',
      500: '#9c27b0', // Admin purple shade
      600: '#8e24aa',
      700: '#7b1fa2',
      800: '#6a1b9a',
      900: '#4a148c',
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('gray.50', 'gray.900')(props),
        color: mode('gray.800', 'white')(props),
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : `${props.colorScheme}.500`,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : `${props.colorScheme}.600`,
          },
        }),
        admin: (props: any) => ({
          bg: 'admin.500',
          color: 'white',
          _hover: {
            bg: 'admin.600',
          },
        }),
      },
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: mode('white', 'gray.800')(props),
          borderRadius: 'md',
          boxShadow: 'base',
          borderColor: mode('gray.200', 'gray.700')(props),
        },
      }),
    },
    Heading: {
      baseStyle: {
        fontWeight: 'semibold',
      },
    },
    Tabs: {
      variants: {
        enclosed: (props: any) => ({
          tab: {
            _selected: {
              bg: mode('white', 'gray.800')(props),
              color: mode('brand.600', 'brand.300')(props),
              borderColor: 'inherit',
              borderBottomColor: mode('white', 'gray.800')(props),
            },
          },
        }),
        'soft-rounded': (props: any) => ({
          tab: {
            _selected: {
              bg: 'brand.500',
              color: 'white',
            },
          },
        }),
      },
    },
  },
});

export default AdminTheme; 