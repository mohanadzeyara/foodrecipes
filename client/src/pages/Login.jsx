import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth && (auth.currentUser || auth.user)) {
      navigate('/');
    }
  }, [auth, navigate]);

  async function tryAuthLogin(emailArg, passArg) {
    if (!auth || !auth.login) return null;
    const fn = auth.login;
    try {
      const r = fn.length >= 2 ? fn(emailArg, passArg) : fn({ email: emailArg, password: passArg });
      return await Promise.resolve(r);
    } catch (err) {
      try {
        return await Promise.resolve(fn({ email: emailArg }));
      } catch (err2) {
        throw err;
      }
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      
      if (!email || !password) throw new Error('Please fill email and password.');
      
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) {
        if (auth && auth.login) {
          await tryAuthLogin(email, password);
        } else {
          throw new Error('Invalid credentials');
        }
      }
      const userObj = { email };

      
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('currentUser', JSON.stringify(userObj));
      if (auth && auth.login) {
        try {
          await tryAuthLogin(email, password);
        } catch (err) {
          
          console.warn('auth.login failed but local storage set', err);
        }
      }

      toast({ title: 'Logged in', status: 'success', duration: 1500, isClosable: true });
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err);
      toast({
        title: err?.message || 'Login failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={16} p={6} bg="white" borderRadius="md" boxShadow="md">
      <Heading mb={4} textAlign="center" color="teal.600">
        Login
      </Heading>

      {error && (
        <Text color="red.500" mb={3}>
          {error.message || 'Something went wrong.'}
        </Text>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>* Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>* Password</FormLabel>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
          </FormControl>

          <Button type="submit" colorScheme="teal" isLoading={loading}>
            Login
          </Button>

          <Text textAlign="center" fontSize="sm">
            Don't have an account?{' '}
            <RouterLink to="/register" style={{ color: '#2C7A7B', fontWeight: 600 }}>
              Register
            </RouterLink>
          </Text>

          <Text textAlign="center" fontSize="xs" color="gray.500">
            Tip: You can register any email/password — the app stores users locally.
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
