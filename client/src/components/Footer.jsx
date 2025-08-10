import React from 'react';
import { Box, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box as="footer" py={6} bg="teal.600" mt={12}>
      <Text color="white" textAlign="center" fontSize="sm">
        &copy; {new Date().getFullYear()} Mohand Zeyara- Final Project - All rights reserved.
      </Text>
    </Box>
  );
}
