const mongoose = require('mongoose');
const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  ingredients: [String],
  steps: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Recipe', RecipeSchema);
