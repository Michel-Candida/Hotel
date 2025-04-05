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
        return res.status(404).json({ success: false, message: "Client not found" });
      }

      res.json({ success: true, client: rows[0] });
    } catch (error) {
      console.error('Error fetching client:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getReservationByClientCode: async (req, res) => {
    const { clientCode } = req.params;
    try {
      const clientResult = await pool.query('SELECT * FROM clients WHERE client_code = $1', [clientCode]);
      if (clientResult.rows.length === 0) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
      }
      const client = clientResult.rows[0];

      const reservationResult = await pool.query(`
        SELECT * FROM reservations
        WHERE client_id = $1 AND status = 'confirmed'
        ORDER BY check_in_date DESC LIMIT 1
      `, [client.client_id]);

      if (reservationResult.rows.length === 0) {
        return res.status(404).json({ error: 'Reserva ativa não encontrada' });
      }

      const reservation = reservationResult.rows[0];

      const companionsResult = await pool.query(`
        SELECT name FROM companions WHERE reservation_id = $1
      `, [reservation.reservation_id]);

      res.json({
        reservation: {
          ...reservation,
          client,
          companions: companionsResult.rows
        }
      });
    } catch (err) {
      console.error("Erro ao buscar reserva:", err);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  checkoutReservation: async (req, res) => {
    const reservationId = req.params.id;
    try {
      const result = await pool.query(`
        UPDATE reservations
        SET check_out_date = CURRENT_DATE, status = 'completed'
        WHERE reservation_id = $1
        RETURNING *`, [reservationId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }

      res.status(200).json({ message: 'Check-out realizado com sucesso', reservation: result.rows[0] });
    } catch (error) {
      console.error("Erro ao realizar check-out:", error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  registerCheckIn: async (req, res) => {
    try {
      const { client_code, number_room, checkin_date, checkout_date, number_of_people, companions } = req.body;

      const clientResult = await pool.query("SELECT client_id FROM clients WHERE client_code = $1", [client_code]);
      if (clientResult.rows.length === 0) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      const client_id = clientResult.rows[0].client_id;

      const reservationResult = await pool.query(
        `INSERT INTO reservations (client_id, number_room, check_in_date, check_out_date, total_guests, status)
         VALUES ($1, $2, $3, $4, $5, 'confirmed') RETURNING reservation_id`,
        [client_id, number_room, checkin_date, checkout_date, number_of_people]
      );

      const reservation_id = reservationResult.rows[0].reservation_id;

      if (companions && companions.length > 0) {
        for (const companion of companions) {
          await pool.query(
            `INSERT INTO companions (client_id, reservation_id, name, date_of_birth, document)
             VALUES ($1, $2, $3, $4, $5)`,
            [client_id, reservation_id, companion.name, companion.date_of_birth, companion.document]
          );
        }
      }

      res.status(201).json({ message: "Check-in realizado com sucesso!", reservation_id });
    } catch (error) {
      console.error("Erro ao processar check-in:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  checkAvailability: async (req, res) => {
    const { number_room, checkin_date, checkout_date } = req.query;

    try {
      const { rows } = await pool.query(
        `SELECT * FROM reservations
         WHERE number_room = $1
         AND (check_in_date < $2 AND check_out_date > $2
         OR check_in_date < $3 AND check_out_date > $3)`,
        [number_room, checkin_date, checkout_date]
      );

      if (rows.length > 0) {
        return res.status(400).json({ success: false, message: "Room is not available for the selected dates" });
      }

      return res.status(200).json({ success: true, message: "Room is available for the selected dates" });
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },
};
