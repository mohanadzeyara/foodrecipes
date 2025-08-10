const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let recipes = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    description: 'Creamy pasta with pancetta and parmesan.',
    image: 'https://images.unsplash.com/photo-1604908177527-32737cbe263b?auto=format&fit=crop&w=400&q=80',
    ingredients: ['pasta', 'eggs', 'pancetta', 'parmesan cheese', 'black pepper'],
    instructions: 'Cook pasta. Fry pancetta. Mix eggs and cheese. Combine all with pepper.',
  },
];

// GET all recipes
app.get('/recipes', (req, res) => {
  res.json(recipes);
});

// GET single recipe by id
app.get('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  res.json(recipe);
});

// POST new recipe
app.post('/recipes', (req, res) => {
  const { title, description, image, ingredients, instructions } = req.body;
  if (!title || !description || !ingredients || !instructions) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newRecipe = {
    id: Date.now().toString(),
    title,
    description,
    image: image || '',
    ingredients,
    instructions,
  };
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

// PUT update recipe by id
app.put('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, image, ingredients, instructions } = req.body;
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: 'Recipe not found' });

  recipes[index] = {
    id,
    title: title || recipes[index].title,
    description: description || recipes[index].description,
    image: image || recipes[index].image,
    ingredients: ingredients || recipes[index].ingredients,
    instructions: instructions || recipes[index].instructions,
  };
  res.json(recipes[index]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
