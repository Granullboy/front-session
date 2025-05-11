// server.js (or app.js/index.js)
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/users', require('./routes/user'));
app.use('/transactions', require('./routes/transactions'));
app.use('/categories', require('./routes/categories'));

const explonation = {"users":
  [
    {
      "/":"get all users",
      "/me":"give your currect user",
      "register":"new user registration"
    }
  ]
}

// Root route
app.get('/', (req, res) => {
  res.send(explonation);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});