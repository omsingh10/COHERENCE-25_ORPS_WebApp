import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// Custom theme for user interface
const UserTheme = extendTheme({
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
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0080ff', // Primary blue shade
      600: '#0064cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
    secondary: {
      50: '#e6fff9',
      100: '#b3ffe8',
      200: '#80ffd8',
      300: '#4dffc7',
      400: '#1affb6',
      500: '#00e6a0', // Secondary teal shade
      600: '#00b380',
      700: '#008060',
      800: '#004d40',
      900: '#001a20',
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
      },
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: mode('white', 'gray.800')(props),
          borderRadius: 'xl',
          boxShadow: 'md',
          borderColor: mode('gray.200', 'gray.700')(props),
        },
      }),
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
      },
    },
    Tabs: {
      variants: {
        enclosed: (props: any) => ({
          tab: {
            fontWeight: 'medium',
            _selected: {
              bg: mode('brand.50', 'brand.900')(props),
              color: mode('brand.600', 'brand.200')(props),
            },
          },
        }),
        'soft-rounded': (props: any) => ({
          tab: {
            fontWeight: 'medium',
            _selected: {
              bg: 'brand.500',
              color: 'white',
            },
          },
        }),
      },
    },
    Menu: {
      baseStyle: (props: any) => ({
        list: {
          bg: mode('white', 'gray.800')(props),
          borderColor: mode('gray.200', 'gray.700')(props),
        },
        item: {
          _hover: {
            bg: mode('brand.50', 'brand.900')(props),
          },
        },
      }),
    },
  },
});

export default UserTheme; 