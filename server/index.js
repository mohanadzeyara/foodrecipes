require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Recipe = require('./models/recipe');
const User = require('./models/user');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash: hash });
    await user.save();
    const token = jwt.sign({ id: user._id.toString(), name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id.toString(), name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/recipes', auth, upload.single('image'), async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : [],
      steps: req.body.steps ? JSON.parse(req.body.steps) : [],
      author: req.user.id
    };
    if (req.file) data.image = req.file.filename;
    const recipe = new Recipe(data);
    await recipe.save();
    await recipe.populate('author', 'name');
    res.json(recipe);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/recipes/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Not found' });
    if (recipe.author && recipe.author.toString() !== req.user.id) return res.status(403).json({ error: 'Not allowed' });
    if (recipe.image && fs.existsSync(path.join(UPLOAD_DIR, recipe.image))) {
      fs.unlinkSync(path.join(UPLOAD_DIR, recipe.image));
    }
    await recipe.remove();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.use('/images', express.static(path.join(__dirname, UPLOAD_DIR)));

async function start() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_recipes_auth';
  const seedData = require('./seeds');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedData();
  })
  .catch(err => {
    console.error('DB connection error:', err);
  });

  app.listen(PORT, () => console.log('Server started on port', PORT));
}
start().catch(err => console.error('Failed to start', err));
