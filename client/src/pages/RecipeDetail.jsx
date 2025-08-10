import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Box, Heading, Text, Image, Button, Spinner } from "@chakra-ui/react";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const foundRecipe = storedRecipes.find((r) => String(r.id) === String(id));
    setRecipe(foundRecipe || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Box textAlign="center" mt={20}>
        <Heading>Recipe Not Found</Heading>
        <Button mt={6} colorScheme="teal" onClick={() => navigate("/")}>
          Go back to Recipes
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" mt={12} p={6} bg="white" borderRadius="md" boxShadow="md">
      <Image
        src={recipe.image}
        alt={recipe.title}
        borderRadius="md"
        mb={6}
        maxHeight="400px"
        objectFit="cover"
        width="100%"
      />
      <Heading mb={4} color="teal.700">{recipe.title}</Heading>
      <Text fontSize="lg" color="gray.700" mb={6}>
        {recipe.details}
      </Text>
      <Button as={Link} to={`/edit/${recipe.id}`} colorScheme="yellow" mr={4}>
        Edit Recipe
      </Button>
      <Button colorScheme="teal" onClick={() => navigate("/")}>
        Back to Recipes
      </Button>
    </Box>
  );
}
