const pool = require('../config/db');

module.exports = {
  getAllReservations: async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT r.reservation_id AS id, c.name AS clientName, r.number_room AS roomNumber
        FROM reservations r
        JOIN clients c ON r.client_id = c.client_id
        WHERE r.status = 'confirmed'
      `);
      res.json(rows);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      res.status(500).json({ error: "Erro ao buscar reservas" });
    }
  },

  getCheckedInGuests: async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT 
          r.reservation_id AS id,
          c.name,
          r.number_room AS roomNumber,
          r.total_guests
        FROM reservations r
        JOIN clients c ON r.client_id = c.client_id
        WHERE r.status = 'confirmed'
      `);
      res.json(rows);
    } catch (error) {
      console.error("Erro ao buscar hóspedes hospedados:", error);
      res.status(500).json({ error: "Erro ao buscar hóspedes" });
    }
  },

  getAvailableRooms: async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT * FROM rooms
        WHERE number_room NOT IN (
          SELECT number_room FROM reservations WHERE status = 'confirmed'
        )
      `);
      res.json(rows);
    } catch (error) {
      console.error("Erro ao buscar quartos disponíveis:", error);
      res.status(500).json({ error: "Erro ao buscar quartos" });
    }
  },

  getPendingReservations: async (req, res) => {
    try {
      const { rows } = await pool.query(`
        SELECT r.reservation_id AS id, c.name AS clientName, r.number_room AS roomNumber
        FROM reservations r
        JOIN clients c ON r.client_id = c.client_id
        WHERE r.status = 'pending'
      `);
      res.json(rows);
    } catch (error) {
      console.error("Erro ao buscar reservas pendentes:", error);
      res.status(500).json({ error: "Erro ao buscar reservas pendentes" });
    }
  },
};
