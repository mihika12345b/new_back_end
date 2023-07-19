const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 8080;

// Configure connection to MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Toyotaecho3+',
  database: 'admin_login',
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from('your_mysql_password' + '\0')
  }
});

// Create database connection
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Configure Express middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Route for registering a user
app.post('/register', (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;

  if (!username || !password || !firstname || !lastname || !email) {
    res.status(400).json({ error: 'Please enter all fields' });
    return;
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const newUser = {
      username: username,
      password: hashedPassword,
      firstname: firstname,
      lastname: lastname,
      email: email
    };

    connection.query('INSERT INTO users SET ?', newUser, (err, result) => {
      if (err) {
        console.error('Error executing the MySQL query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      res.status(200).json({ success: 'User registered successfully!' });
    });
  });
});

// Route for user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Please enter both username and password' });
    return;
  }

  connection.query('SELECT * FROM users WHERE username = ?', username, (err, results) => {
    if (err) {
      console.error('Error executing the MySQL query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      if (isMatch) {
        res.status(200).json({ success: 'Login successful!' });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});