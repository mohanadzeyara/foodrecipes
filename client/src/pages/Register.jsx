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

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const auth = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth && (auth.currentUser || auth.user)) {
      navigate('/');
    }
  }, [auth, navigate]);

  async function tryAuthRegister(emailArg, passArg) {
    if (!auth || !auth.register) return null;
    const fn = auth.register;
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
      if (!email || !password || !confirm) throw new Error('Please fill all fields.');
      if (password !== confirm) throw new Error('Passwords do not match.');
      if (password.length < 4) throw new Error('Password must be at least 4 characters.');

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const exists = users.find((u) => u.email === email);
      if (exists) throw new Error('Email already registered.');

      const newUser = { email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      if (auth && auth.register) {
        try {
          await tryAuthRegister(email, password);
        } catch (err) {
          console.warn('auth.register threw, but local user saved', err);
        }
      }

      toast({ title: 'Registered successfully. Please login.', status: 'success', duration: 2000 });

      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err);
      toast({
        title: err?.message || 'Registration failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} bg="white" borderRadius="md" boxShadow="md">
      <Heading mb={4} textAlign="center" color="teal.600">
        Register
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
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>* Password</FormLabel>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>* Confirm Password</FormLabel>
            <Input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" />
          </FormControl>

          <Button type="submit" colorScheme="teal" isLoading={loading}>
            Register
          </Button>

          <Text textAlign="center" fontSize="sm">
            Already registered?{' '}
            <RouterLink to="/login" style={{ color: '#2C7A7B', fontWeight: 600 }}>
              Login
            </RouterLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
