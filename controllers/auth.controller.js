const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

const generateToken = (user) => {
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = '1h'; // Token expiration time, you can change it as per your needs
  return jwt.sign({ id: user.id, username: user.username }, secretKey, {
    expiresIn,
  });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const token = generateToken(user);

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

module.exports = {
  register,
  login,
};
