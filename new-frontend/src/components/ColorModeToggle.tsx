import React from 'react';
import { IconButton, useColorMode, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { FiMoon, FiSun } from 'react-icons/fi';

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const SwitchIcon = colorMode === 'light' ? FiMoon : FiSun;
  const nextMode = colorMode === 'light' ? 'dark' : 'light';
  
  return (
    <Tooltip label={`Switch to ${nextMode} mode`} placement="bottom">
      <IconButton
        size="md"
        fontSize="lg"
        aria-label={`Switch to ${nextMode} mode`}
        variant="ghost"
        color={useColorModeValue('gray.600', 'gray.200')}
        onClick={toggleColorMode}
        icon={<SwitchIcon />}
        _hover={{
          bg: useColorModeValue('gray.100', 'gray.700'),
        }}
      />
    </Tooltip>
  );
};

export default ColorModeToggle; 