import React from 'react';
import { IconButton, useColorMode, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { FiMoon, FiSun } from 'react-icons/fi';

const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const SwitchIcon = colorMode === 'light' ? FiMoon : FiSun;
  const nextMode = colorMode === 'light' ? 'dark' : 'light';
  
  // Use color mode value to ensure the icon is visible in both modes
  const iconColor = useColorModeValue('gray.800', 'white');
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Tooltip label={`Switch to ${nextMode} mode`} placement="bottom">
      <IconButton
        aria-label={`Switch to ${nextMode} mode`}
        variant="ghost"
        color={iconColor}
        bg={bgColor}
        _hover={{ bg: hoverBgColor }}
        icon={<SwitchIcon size={18} />}
        onClick={toggleColorMode}
        size="md"
        ml={2}
        rounded="full"
      />
    </Tooltip>
  );
};

export default ColorModeToggle; 