
export function fetchRecipes() {
  try {
    const data = localStorage.getItem('recipes');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error reading recipes from storage:", err);
    return [];
  }
}

export function fetchRecipeById(id) {
  try {
    const recipes = fetchRecipes();
    return recipes.find(r => r.id === id) || null;
  } catch (err) {
    console.error("Error fetching recipe by ID:", err);
    return null;
  }
}

export function addRecipe(recipe) {
  try {
    const recipes = fetchRecipes();
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    return true;
  } catch (err) {
    console.error("Error adding recipe:", err);
    return false;
  }
}
export function updateRecipe(id, updatedData) {
  try {
    let recipes = fetchRecipes();
    recipes = recipes.map(recipe =>
      recipe.id === id ? { ...recipe, ...updatedData } : recipe
    );
    localStorage.setItem('recipes', JSON.stringify(recipes));
    return true;
  } catch (err) {
    console.error("Error updating recipe:", err);
    return false;
  }
}
export function deleteRecipe(id) {
  try {
    let recipes = fetchRecipes();
    recipes = recipes.filter(recipe => recipe.id !== id);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    return true;
  } catch (err) {
    console.error("Error deleting recipe:", err);
    return false;
  }
}
