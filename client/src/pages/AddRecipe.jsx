import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

export default function AddRecipe() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState("");

  const handleAdd = () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    
    const newId =
      storedRecipes.length > 0
        ? Math.max(...storedRecipes.map((r) => Number(r.id))) + 1
        : 1;

    const newRecipe = {
      id: newId,
      title,
      description,
      details,
      image,
    };

    const updatedRecipes = [...storedRecipes, newRecipe];
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));

    navigate(`/recipe/${newId}`);
  };

  return (
    <Box maxW="lg" mx="auto" mt={12} p={6} bg="white" borderRadius="md" boxShadow="md">
      <Heading mb={6} color="teal.700">Add New Recipe</Heading>

      <FormControl mb={4} isRequired>
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

      <Button colorScheme="green" onClick={handleAdd} mr={4}>
        Add Recipe
      </Button>
      <Button onClick={() => navigate("/")}>Cancel</Button>
    </Box>
  );
}
