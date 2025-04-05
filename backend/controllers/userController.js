const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

module.exports = {
  createUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email and password are required." });
      }

      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "Email already registered." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id, name, email',
        [name, email, hashedPassword]
      );

      res.status(201).json({ message: "User created successfully", user: result.rows[0] });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: error.message });
    }
  },

  listUsers: async (req, res) => {
    try {
      const result = await pool.query('SELECT user_id, name, email FROM users');
      res.json(result.rows);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      res.status(500).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    const { name, password } = req.body;

    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE name ILIKE $1", [name]);

      if (rows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};
