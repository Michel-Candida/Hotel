const pool = require('../config/db');

module.exports = {
  getClientByCode: async (req, res) => {
    const { clientCode } = req.params;

    try {
      const { rows } = await pool.query(
        'SELECT * FROM clients WHERE client_code = $1',
        [clientCode]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Client not found"
        });
      }

      res.json({
        success: true,
        client: rows[0]
      });
    } catch (error) {
      console.error('Error fetching client:', error.message, error.stack);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  updateClient: async (req, res) => {
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
      console.error("Error updating client:", error.message, error.stack);
      res.status(500).json({ message: "Server error" });
    }
  },

  registerClient: async (req, res) => {
    const { name, email, phone, document } = req.body;

    try {
      // Verificação de duplicidade de documento
      const { rows: existing } = await pool.query(
        "SELECT * FROM clients WHERE document = $1",
        [document]
      );

      if (existing.length > 0) {
        return res.status(400).json({ message: "Document already exists." });
      }

      const clientCode = 'CLI' + Date.now().toString().slice(-6);

      const { rows } = await pool.query(
        "INSERT INTO clients (client_code, name, email, phone, document) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [clientCode, name, email, phone, document]
      );

      res.status(201).json({ message: "Client registered successfully", client: rows[0] });
    } catch (error) {
      console.error('Error registering client:', error.message, error.stack);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  searchClients: async (req, res) => {
    const validFilters = ["name", "document", "phone", "email", "client_code"];
    const query = req.query;

    const filters = Object.keys(query).filter(key =>
      validFilters.includes(key) && query[key]?.toString().trim()
    );

    if (filters.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Parâmetros de busca inválidos",
        valid_filters: validFilters
      });
    }

    try {
      const conditions = [];
      const values = [];

      filters.forEach((filter, index) => {
        if (filter === 'name') {
          conditions.push(`name ILIKE $${index + 1}`);
          values.push(`%${query[filter]}%`);
        } else {
          conditions.push(`${filter} = $${index + 1}`);
          values.push(query[filter]);
        }
      });

      const { rows } = await pool.query(
        `SELECT client_id, client_code, name, document, phone, email,
         TO_CHAR(created_at, 'DD/MM/YYYY') as registration_date
         FROM clients 
         WHERE ${conditions.join(' OR ')}
         ORDER BY name ASC
         LIMIT 100`,
        values
      );

      res.json({
        success: true,
        count: rows.length,
        data: rows
      });

    } catch (error) {
      console.error("Database error:", error.message, error.stack);
      res.status(500).json({
        success: false,
        message: "Erro no servidor"
      });
    }
  }
};
