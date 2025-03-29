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
    // Gerar client_code automático (ex: CLI+timestamp)
    const clientCode = 'CLI' + Date.now().toString().slice(-6);

    const { rows } = await pool.query(
      "INSERT INTO clients (client_code, name, email, phone, document) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [clientCode, name, email, phone, document]
    );
    
    res.status(201).json({ message: "Client registered successfully", client: rows[0] });
  } catch (error) {
    console.error('Error registering client:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Search Clients
app.get("/api/clients/search", async (req, res) => {
  const validFilters = ["name", "document", "phone", "email", "client_code"];
  const { ...queryParams } = req.query;

  // Validação dos parâmetros
  const filters = Object.keys(queryParams).filter(param => {
    if (!validFilters.includes(param)) return false;
    const value = queryParams[param]?.toString().trim();
    return value && value.length > 0;
  });

  if (!filters.length) {
    return res.status(400).json({ 
      error: "Parâmetros de busca inválidos",
      valid_filters: validFilters,
      example: "/api/clients/search?name=Maria&document=123.456.789-00"
    });
  }

  try {
    const conditions = [];
    const values = [];
    
    filters.forEach((filter, index) => {
      const paramIndex = index + 1;
      const searchTerm = queryParams[filter].trim();
      
      if (filter === "name") {
        // Busca por partes do nome (case insensitive)
        conditions.push(`name ILIKE $${paramIndex}`);
        values.push(`%${searchTerm}%`);
      } 
      else if (filter === "client_code") {
        // Busca exata por código
        conditions.push(`client_code = $${paramIndex}`);
        values.push(searchTerm);
      }
      else {
        // Busca exata para outros campos
        conditions.push(`${filter} = $${paramIndex}`);
        values.push(searchTerm);
      }
    });

    const query = {
      text: `SELECT 
              client_id,
              client_code,
              name,
              document,
              phone,
              email,
              TO_CHAR(created_at, 'DD/MM/YYYY') as registration_date
             FROM clients 
             WHERE ${conditions.join(" OR ")}
             ORDER BY name ASC
             LIMIT 100`,
      values: values
    };

    const { rows } = await pool.query(query);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhum cliente encontrado com os critérios fornecidos",
        search_params: queryParams,
        suggestion: "Verifique a ortografia ou tente critérios mais amplos"
      });
    }

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Erro no servidor",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
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

/// Route to register a new room
app.post("/rooms", async (req, res) => {
  const { number_room, name, type_room, category_room, beds, size, options } = req.body;
  
  const formattedOptions = options && Array.isArray(options) ? options : [];

  try {
    // Verificar se o número do quarto já existe
    const existingRoom = await pool.query(
      "SELECT * FROM rooms WHERE number_room = $1",
      [number_room]
    );

    if (existingRoom.rows.length > 0) {
      return res.status(400).json({ message: "Room number already exists" });
    }

    const { rows } = await pool.query(
      `INSERT INTO rooms 
       (number_room, name, type_room, category_room, beds, size, options) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING number_room, name, type_room, category_room`,
      [number_room, name, type_room, category_room, beds, size, formattedOptions]
    );
    
    res.status(201).json({ 
      message: "Room registered successfully", 
      room: rows[0] 
    });
  } catch (error) {
    console.error("Error registering room:", error);
    res.status(500).json({ 
      message: "Server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

// Fetch room data by number_room
app.get('/api/rooms/:numberRoom', async (req, res) => {
  const { numberRoom } = req.params;  
  
  try {
      const { rows } = await pool.query(
        'SELECT * FROM rooms WHERE number_room = $1', 
        [numberRoom]
      );  
      
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
app.put("/api/rooms/:numberRoom", async (req, res) => {  
  const { numberRoom } = req.params; 
  const { name, type_room, category_room, beds, size, options } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE rooms SET 
        name = $1, 
        type_room = $2, 
        category_room = $3, 
        beds = $4, 
        size = $5, 
        options = $6 
       WHERE number_room = $7 
       RETURNING number_room, name, type_room, category_room`,
      [name, type_room, category_room, beds, size, options, numberRoom]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ 
      message: "Room updated successfully", 
      room: rows[0] 
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
