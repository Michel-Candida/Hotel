require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Pool } = require('pg');
const { hashPassword, comparePassword } = require('./authUtils.js'); // Import utility functions

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL Configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Example route to test the backend
app.get("/api/login", (req, res) => {
  res.json({ message: "Hotel backend is running!" });
});

// Route to fetch example data using Axios
app.get("/api/data", async (req, res) => {
  try {
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Route to register a user
app.post('/api/users', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Email validation
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email' });
  }

  try {
    // Check if email is already registered
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Password validation
    const validatePassword = (password) => {
      return password.length >= 8 && password.length <= 16;
    };

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be between 8 and 16 characters' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Generate password hash
    const hashedPassword = await hashPassword(password);

    // Insert user into the database
    const { rows } = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'User successfully registered', user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Route to log in
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = rows[0];

    // Compare provided password with stored hash
    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(401).send('Incorrect password');
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  }
});

// Route to fetch client by code
app.get('/clients/client_code', async (req, res) => {
  try {
      const { clientCode } = req.params;
      const result = await pool.query('SELECT * FROM clients WHERE client_code = $1', [clientCode]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "Client not found" });
      }

      res.json(result.rows[0]);
  } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ message: "Server error" });
  }
});

// Route to fetch companion by code
app.get('/companions/code', async (req, res) => {
  try {
      const { code } = req.params;
      const result = await pool.query('SELECT * FROM companions WHERE code = $1', [code]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "Companion not found" });
      }

      res.json(result.rows[0]);
  } catch (error) {
      console.error("Error fetching companion:", error);
      res.status(500).json({ message: "Server error" });
  }
});


// Route to handle check-in
app.post('/checkin', (req, res) => {
  console.log("Check-in received:", req.body);
  res.status(201).json({ message: 'Check-in successful' });
});

// Route to handle check-out
app.post('/checkout', (req, res) => {
  console.log("Check-Out completed:", req.body);
  res.json({ message: "Check-Out successful!" });
});

//client register

// Route to register a client
app.post('/clients', async (req, res) => {
  const { client_code, name, email, phone, document } = req.body;

  // Validate the inputs
  if (!name || !email || !document) {
    return res.status(400).json({ error: 'Name, Email, and Document are required' });
  }

  try {
    // Check if the email or document is already registered
    const existingClient = await pool.query(
      'SELECT * FROM clients WHERE email = $1 OR document = $2',
      [email, document]
    );

    if (existingClient.rows.length > 0) {
      return res.status(400).json({ error: 'Email or Document already registered' });
    }

    // Insert the new client into the database
    const query = `
      INSERT INTO clients (client_code, name, email, phone, document)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [client_code, name, email, phone, document];

    const { rows } = await pool.query(query, values);
    res.status(201).json({ message: 'Client registered successfully', client: rows[0] });
  } catch (error) {
    console.error('Error registering client:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to get the next client code
app.get('/clients/next-code', async (req, res) => {
  try {
    const result = await pool.query('SELECT MAX(client_code) AS max_code FROM clients');
    const nextCode = result.rows[0].max_code ? result.rows[0].max_code + 1 : 1;
    res.json({ nextClientCode: nextCode });
  } catch (error) {
    console.error('Error generating client code:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to search for clients
app.get('/api/search', async (req, res) => {
  try {
      const { name, document, phone, email } = req.query;
      let query = 'SELECT * FROM clients WHERE ';
      let conditions = [];
      let values = [];

      if (name) {
          conditions.push(`name ILIKE $${conditions.length + 1}`);
          values.push(`%${name}%`);
      }
      if (document) {
          conditions.push(`document = $${conditions.length + 1}`);
          values.push(document);
      }
      if (phone) {
          conditions.push(`phone = $${conditions.length + 1}`);
          values.push(phone);
      }
      if (email) {
          conditions.push(`email = $${conditions.length + 1}`);
          values.push(email);
      }

      if (conditions.length === 0) {
          return res.status(400).json({ error: 'No search criteria provided' });
      }

      query += conditions.join(' OR ');
      const { rows } = await pool.query(query, values);
      res.json(rows); // Certifique-se de que a resposta é um JSON
  } catch (error) {
      console.error('Error searching for clients:', error);
      res.status(500).json({ error: 'Server error' });
  }
});
