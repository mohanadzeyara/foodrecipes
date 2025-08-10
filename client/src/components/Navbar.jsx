import React from 'react';
import { Box, Flex, Link, Spacer, Button } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Box bg="blue.600" px={4} py={3} color="white">
      <Flex maxW="7xl" mx="auto" align="center">
        <Link as={RouterLink} to="/recipes-content" fontWeight="bold" fontSize="xl">
          FoodProject
        </Link>
        <Spacer />
        <Link as={RouterLink} to="/profile" mr={4}>
          Profile
        </Link>
        <Button colorScheme="red" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
    </Box>
  );
}
