require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Pool } = require("pg");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000" })); 
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,     
  host: process.env.DB_HOST,      
  database: process.env.DB_DATABASE, 
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT,      
});

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

app.get("/api/status", (req, res) => res.json({ message: "Hotel backend is running!" }));

// Fetch example data
app.get("/api/data", async (req, res) => {
  try {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Client Routes
app.get("/clients/:clientCode", async (req, res) => {
  try {
    const { clientCode } = req.params;
    const { rows } = await pool.query("SELECT * FROM clients WHERE client_code = $1", [clientCode]);
    if (!rows.length) return res.status(404).json({ message: "Client not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to update client
app.put("/clients/:clientCode", async (req, res) => {
  const { clientCode } = req.params;
  const { name, email, phone, document } = req.body;

  try {
    const { rows: existingClient } = await pool.query(
      "SELECT * FROM clients WHERE client_code = $1",
      [clientCode]
    );

    if (existingClient.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    const { rows: documentCheck } = await pool.query(
      "SELECT * FROM clients WHERE document = $1 AND client_code != $2",
      [document, clientCode]
    );

    if (documentCheck.length > 0) {
      return res.status(400).json({ message: "Document already exists. Please use a different one." });
    }

    const { rows } = await pool.query(
      "UPDATE clients SET name = $1, email = $2, phone = $3, document = $4 WHERE client_code = $5 RETURNING *",
      [name, email, phone, document, clientCode]
    );

    res.status(200).json({ message: "Client updated successfully", client: rows[0] });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to register clients
app.post("/clients", async (req, res) => {
  const { name, email, phone, document } = req.body;
  
  try {
    // Verificar se o email já existe
    const { rows: emailCheck } = await pool.query(
      "SELECT * FROM clients WHERE email = $1",
      [email]
    );
    
    // Verificar se o documento já existe
    const { rows: documentCheck } = await pool.query(
      "SELECT * FROM clients WHERE document = $1",
      [document]
    );
    
    // Se ambos já existem, retornar erro específico
    if (emailCheck.length && documentCheck.length) {
      return res.status(400).json({ message: "Email and Document already exist" });
    }
    
    // Se apenas o email já existe
    if (emailCheck.length) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    // Se apenas o documento já existe
    if (documentCheck.length) {
      return res.status(400).json({ message: "Document already exists" });
    }
    
    // Inserir o novo cliente no banco de dados
    const { rows } = await pool.query(
      "INSERT INTO clients (name, email, phone, document) VALUES ($1, $2, $3, $4) RETURNING client_code, name, email, phone, document",
      [name, email, phone, document]
    );
    
    res.status(201).json({ message: "Client registered successfully", client: rows[0] });
  } catch (error) {
    console.error('Error registering client:', error); // Log do erro detalhado
    res.status(500).json({ message: "Server error", error: error.message }); // Inclui o erro no retorno
  }
});

// Search Clients
app.get("/api/search", async (req, res) => {
  const filters = ["name", "document", "phone", "email"];
  const conditions = [];
  const values = [];

  filters.forEach((filter) => {
    if (req.query[filter]) {
      if (filter === "name") {
        // Para nome, permitir busca parcial (case-insensitive)
        conditions.push(`${filter} ILIKE $${conditions.length + 1}`);
        values.push(`%${req.query[filter]}%`);
      } else {
        // Para document, phone e email, busca exata
        conditions.push(`${filter} = $${conditions.length + 1}`);
        values.push(req.query[filter]);
      }
    }
  });

  if (!conditions.length) {
    return res.status(400).json({ error: "No search criteria provided" });
  }

  try {
    const { rows } = await pool.query(
      `SELECT * FROM clients WHERE ${conditions.join(" OR ")}`,
      values
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post('/users', async (req, res) => {
  try {
      const { name, password } = req.body;
      
      // Hash da senha antes de armazenar
      const hashedPassword = await bcrypt.hash(password, 10); 

      const result = await pool.query(
          'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *',
          [name, hashedPassword]
      );

      res.status(201).json({ message: "User created successfully", user: result.rows[0] });
  } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: error.message });
  }
});

// List users
app.get('/users', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM users');
      res.json(result.rows);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  try {
      const { id } = req.params;
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
      res.json({ message: 'User deleted' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
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

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to register a new room
app.post("/rooms", async (req, res) => {
  const { name, beds, bathroom, capacity, size, options } = req.body;
  
  const formattedOptions = options && Array.isArray(options) ? options : [];

  try {
    const { rows } = await pool.query(
      "INSERT INTO rooms (name, beds, bathroom, capacity, size, options) VALUES ($1, $2, $3, $4, $5, $6) RETURNING room_id",
      [name, beds, bathroom, capacity, size, formattedOptions]
    );
    
    res.status(201).json({ message: "Room registered successfully", room: rows[0] });
  } catch (error) {
    console.error("Error registering room:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch room data by room_id
app.get('/api/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;  
  
  try {
      const { rows } = await pool.query('SELECT * FROM rooms WHERE room_id = $1', [roomId]);  
      
      if (rows.length === 0) {
          return res.status(404).json({ message: "Room not found" });
      }

      res.json(rows[0]);
  } catch (error) {
      console.error('Error fetching room:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Update room details
app.put("/api/rooms/:roomId", async (req, res) => {  
  const { roomId } = req.params; 
  const { name, beds, bathroom, capacity, size, options } = req.body;

  try {
    // Check if room exists
    const { rows: existingRoom } = await pool.query(
      "SELECT * FROM rooms WHERE room_id = $1",  
      [roomId]
    );

    if (existingRoom.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    const { rows } = await pool.query(
      "UPDATE rooms SET name = $1, beds = $2, bathroom = $3, capacity = $4, size = $5, options = $6 WHERE room_id = $7 RETURNING *",  // Alteração para room_id
      [name, beds, bathroom, capacity, size, options, roomId]
    );

    res.status(200).json({ message: "Room updated successfully", room: rows[0] });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
