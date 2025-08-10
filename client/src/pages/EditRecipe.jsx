import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const recipeToEdit = storedRecipes.find((r) => String(r.id) === String(id));

    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setDescription(recipeToEdit.description);
      setDetails(recipeToEdit.details);
      setImage(recipeToEdit.image || "");
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  const handleUpdate = () => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const updatedRecipes = storedRecipes.map((recipe) =>
      String(recipe.id) === String(id)
        ? { ...recipe, title, description, details, image }
        : recipe
    );
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    navigate(`/recipe/${id}`);
  };

  return (
    <Box maxW="lg" mx="auto" mt={12} p={6} bg="white" borderRadius="md" boxShadow="md">
      <Heading mb={6} color="teal.700">Edit Recipe</Heading>

      <FormControl mb={4}>
        <FormLabel>Title</FormLabel>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Description</FormLabel>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Details</FormLabel>
        <Textarea value={details} onChange={(e) => setDetails(e.target.value)} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Image URL</FormLabel>
        <Input value={image} onChange={(e) => setImage(e.target.value)} />
      </FormControl>

      <Button colorScheme="teal" onClick={handleUpdate} mr={4}>
        Save Changes
      </Button>
      <Button onClick={() => navigate(`/recipe/${id}`)}>Cancel</Button>
    </Box>
  );
}
