const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON data
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Define a route for the root path ('/')
app.get('/', (req, res) => {
  res.send('Welcome to the authentication API.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
