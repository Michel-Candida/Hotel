const pool = require('../config/db');

module.exports = {
  registerRoom: async (req, res) => {
    const { number_room, name, type_room, category_room, beds, size, options } = req.body;
    
    const formattedOptions = options && Array.isArray(options) ? options : [];

    try {
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
  },

  listRooms: async (req, res) => {
    try {
      const { rows } = await pool.query("SELECT * FROM rooms ORDER BY number_room");
      res.json(rows);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  getRoomByNumber: async (req, res) => {
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
  },

  updateRoom: async (req, res) => {  
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
  },

  searchRooms: async (req, res) => {
    const { number_room, name } = req.query;

    // Validação básica
    if (!number_room && !name) {
        return res.status(400).json({
            success: false,
            message: "Provide at least one search parameter (number_room or name)"
        });
    }

    try {
        let query = "SELECT * FROM rooms WHERE";
        const conditions = [];
        const values = [];
        
        if (number_room) {
            conditions.push(`number_room = $${conditions.length + 1}`);
            values.push(number_room);
        }
        
        if (name) {
            conditions.push(`name ILIKE $${conditions.length + 1}`);
            values.push(`%${name}%`);
        }

        query += " " + conditions.join(" AND");

        console.log("Executing query:", query, values); // Log para depuração
        
        const { rows } = await pool.query(query, values);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error("Search error:", {
            query: req.query,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: "Database error",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
}
};