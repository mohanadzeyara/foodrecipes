import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box, Flex, Button, Text } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipesContent from './pages/RecipesContent';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import Footer from './components/Footer';
import { useLocation } from 'react-router-dom';


function Header() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const hideLogout = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Flex
    bg="teal.600"
    color="white"
    p={4}
    justifyContent="space-between"
    alignItems="center"
    mb={4}
    boxShadow="md"
  >
    <Text fontWeight="bold" fontSize="lg">
      Mohanad Zeyara - Final Project - Recipes App
    </Text>
    {!hideLogout && currentUser && (
      <Flex alignItems="center" gap={4}>
        <Text>Welcome, {currentUser.email}</Text>
        <Button colorScheme="red" size="sm" onClick={logout}>
          Logout
        </Button>
      </Flex>
    )}
  </Flex>
  );
}

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <BrowserRouter>
          <Box minHeight="100vh" bg="gray.50" pb={10}>
            <Header />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<PrivateRoute />}>
                <Route path="/" element={<RecipesContent />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
                <Route path="/add" element={<AddRecipe />} />
                <Route path="/edit/:id" element={<EditRecipe />} />
              </Route>
            </Routes>
            <Footer />
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
