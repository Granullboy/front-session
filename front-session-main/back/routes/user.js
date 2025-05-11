// routes/users.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readData, writeData } = require('../utils/dataHelpers');

const JWT_SECRET = 'Aboba';

// Mock database (replace with real DB in production)
let {users, lastId} = readData('users.json');
function saveUsers() {
  writeData('users.json', users);
}

// Register new user
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  if (users.some(user => user.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 8);

  lastId = lastId + 1

  const newUser = {
    id: lastId,
    name,
    email,
    password: hashedPassword
  };

  users.push(newUser);
  saveUsers();

  // Create token
  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '24h' });

  res.status(201).json({
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    },
    token
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check password
  const passwordValid = bcrypt.compareSync(password, user.password);
  console.log(passwordValid);
  if (!passwordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create token
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
  console.log(token);
  // Return user data and token
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token
  });
});

// Get current user (protected route)
router.get('/me', authenticateToken, (req, res) => {
  const user = users.find(user => user.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email
  });
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

router.get('/', (req, res) => {
  console.log(process.env.JWT_SECRET)
  res.json(users);
});

router.get('/JWT_SECRET', (req, res) => {
  if(JWT_SECRET == undefined)
    res.json("undefined");
  console.log(JWT_SECRET);
  res.json(JWT_SECRET);
});

module.exports = router;