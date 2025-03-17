require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Pool } = require("pg");
// const { hashPassword, comparePassword } = require("./authUtils.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

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
    console.error('Server error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Search Clients
app.get("/api/search", async (req, res) => {
  const filters = ["name", "document", "phone", "email"];
  const conditions = [];
  const values = [];
  filters.forEach((filter) => {
    if (req.query[filter]) {
      conditions.push(`${filter} ILIKE $${conditions.length + 1}`);
      values.push(`%${req.query[filter]}%`);
    }
  });
  if (!conditions.length) return res.status(400).json({ error: "No search criteria provided" });
  try {
    const { rows } = await pool.query(`SELECT * FROM clients WHERE ${conditions.join(" OR ")}`, values);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to fetch a reservation by client code
app.get("/reservas/:clientCode", async (req, res) => {
  try {
    const { clientCode } = req.params;

    // Buscar a reserva do cliente
    const { rows: checkinRows } = await pool.query(
      "SELECT * FROM checkins WHERE client_code = $1 ORDER BY checkin_date DESC LIMIT 1",
      [clientCode]
    );
    if (checkinRows.length === 0) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const checkinData = checkinRows[0];
    // Buscar os acompanhantes do cliente
    const { rows: companionsRows } = await pool.query(
      "SELECT * FROM companions WHERE checkin_id = $1",
      [checkinData.checkin_id]
    );

    res.json({
      checkinData,
      companions: companionsRows,
    });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to handle check-in
app.post("/checkin", async (req, res) => {
  const { clientCode, roomNumber, checkInDate, checkOutDate, numberOfPeople, companions } = req.body;

  try {
    // Verificar se o cliente existe
    const { rows: clientRows } = await pool.query(
      "SELECT * FROM clients WHERE client_code = $1",
      [clientCode]
    );
    if (clientRows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Inserir o check-in no banco de dados
    const { rows: checkInRows } = await pool.query(
      "INSERT INTO checkins (client_code, room_number, checkin_date, checkout_date, number_of_people) VALUES ($1, $2, $3, $4, $5) RETURNING checkin_id",
      [clientCode, roomNumber, checkInDate, checkOutDate, numberOfPeople]
    );

    const checkinId = checkInRows[0].checkin_id;

    // Inserir os acompanhantes, se houver
    for (const companion of companions) {
      await pool.query(
        "INSERT INTO companions (client_code, name, phone, document) VALUES ($1, $2, $3, $4)",
        [clientCode, companion.name, companion.phone, companion.document]
      );
    }

    res.status(200).json({ message: "Check-in and companions added successfully!" });
  } catch (error) {
    console.error("Error during check-in:", error);
    res.status(500).json({ message: "Server error during check-in" });
  }
});

// Room availability validation for check-in
app.get("/check-room-availability", async (req, res) => {
  const { room_number, checkin_date } = req.query;

  if (!room_number || !checkin_date) {
    return res.status(400).json({ message: "Room number and check-in date are required" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT COUNT(*) AS ocupacoes FROM checkins WHERE room_number = $1 AND checkin_date = $2",
      [room_number, checkin_date]
    );

    const isAvailable = parseInt(rows[0].ocupacoes) === 0; // Converte para inteiro

    res.json({ available: isAvailable });
  } catch (error) {
    console.error("Error checking room availability:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // Function to generate a unique client code
// const generateUniqueClientCode = async () => {
//   const generateCode = () => {
//     return 'C' + Math.random().toString(36).substr(2, 9).toUpperCase(); // Generate a random code in the format 'CXXXXXXXXX'
//   };

//   let clientCode = generateCode();
//   let isUnique = false;

//   // Check if the generated code already exists in the database
//   while (!isUnique) {
//     const { rows } = await pool.query("SELECT * FROM clients WHERE client_code = $1", [clientCode]);
//     if (rows.length === 0) {
//       isUnique = true; // Unique code found
//     } else {
//       clientCode = generateCode(); // Generate a new code if the previous one already exists
//     }
//   }

//   return clientCode;
// };