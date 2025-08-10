import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text, Image, Button, Stack, Spinner } from "@chakra-ui/react";

export default function RecipesContent() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
      setRecipes(storedRecipes);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6} color="teal.700">Recipes</Heading>

      {error && (
        <Text color="red.500" mb={4}>
          {error.message || "Something went wrong loading recipes."}
        </Text>
      )}

      {recipes.length === 0 ? (
        <Text>No recipes found. Add one!</Text>
      ) : (
        <Stack spacing={6}>
          {recipes.map((recipe) => (
            <Box
              key={recipe.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="md"
              bg="white"
            >
              {recipe.image && (
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  borderRadius="md"
                  mb={4}
                  maxHeight="250px"
                  objectFit="cover"
                  width="100%"
                />
              )}
              <Heading size="md" mb={2}>{recipe.title}</Heading>
              <Text mb={4}>{recipe.description}</Text>
              <Button as={Link} to={`/recipe/${recipe.id}`} colorScheme="teal">
                View Details
              </Button>
            </Box>
          ))}
        </Stack>
      )}

      <Button as={Link} to="/add" mt={8} colorScheme="green">
        Add Recipe
      </Button>
    </Box>
  );
}

