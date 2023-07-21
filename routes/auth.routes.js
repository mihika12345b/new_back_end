const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route.' });
});

module.exports = router;
