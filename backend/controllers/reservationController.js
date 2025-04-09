const pool = require('../config/db');

module.exports = {
  // ✅ Buscar cliente pelo código
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
          message: "Cliente não encontrado"
        });
      }

      res.json({
        success: true,
        client: rows[0]
      });
    } catch (error) {
      console.error('❌ Erro ao buscar cliente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  // ✅ Registrar check-in
  registerCheckIn: async (req, res) => {
    try {
      let {
        client_code,
        number_room,
        checkin_date,
        checkout_date,
        number_of_people,
        companions
      } = req.body;

      console.log("📥 Recebendo dados do frontend:", req.body);

      // Validação básica de datas
      if (!checkin_date || !checkout_date) {
        return res.status(400).json({ error: "Datas de check-in e check-out são obrigatórias" });
      }

      // Converte para formato aceito pelo PostgreSQL (YYYY-MM-DD)
      checkin_date = new Date(checkin_date).toISOString().split('T')[0];
      checkout_date = new Date(checkout_date).toISOString().split('T')[0];

      // 🔎 Verifica conflitos de reserva
      const conflictingReservations = await pool.query(
        `SELECT * FROM reservations
         WHERE number_room = $1
         AND status = 'confirmed'
         AND check_in_date < $3
         AND check_out_date > $2`,
        [number_room, checkin_date, checkout_date]
      );

      if (conflictingReservations.rows.length > 0) {
        return res.status(400).json({ error: "Quarto indisponível para as datas selecionadas." });
      }

      // 🔄 Buscar client_id pelo código
      const clientResult = await pool.query(
        "SELECT client_id FROM clients WHERE client_code = $1",
        [client_code]
      );

      if (clientResult.rows.length === 0) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      const client_id = clientResult.rows[0].client_id;

      // 📦 Criar reserva
      const reservationResult = await pool.query(
        `INSERT INTO reservations (client_id, number_room, check_in_date, check_out_date, total_guests, status)
         VALUES ($1, $2, $3, $4, $5, 'confirmed') RETURNING reservation_id`,
        [client_id, number_room, checkin_date, checkout_date, number_of_people]
      );

      const reservation_id = reservationResult.rows[0].reservation_id;
      console.log("✅ Reserva criada com sucesso! ID:", reservation_id);

      // 👥 Inserir acompanhantes, se houver
      if (companions && companions.length > 0) {
        for (const companion of companions) {
          await pool.query(
            `INSERT INTO companions (client_id, reservation_id, name, date_of_birth, document)
             VALUES ($1, $2, $3, $4, $5)`,
            [client_id, reservation_id, companion.name, companion.date_of_birth, companion.document]
          );
        }
        console.log(`👥 ${companions.length} acompanhante(s) adicionados!`);
      }

      res.status(201).json({ message: "Check-in realizado com sucesso!", reservation_id });

    } catch (error) {
      console.error("❌ Erro ao processar o check-in:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // ✅ Verificar disponibilidade de quarto
  checkAvailability: async (req, res) => {
    let { number_room, checkin_date, checkout_date } = req.query;

    try {
      checkin_date = new Date(checkin_date).toISOString().split('T')[0];
      checkout_date = new Date(checkout_date).toISOString().split('T')[0];

      const { rows } = await pool.query(
        `SELECT * FROM reservations
         WHERE number_room = $1
         AND status = 'confirmed'
         AND check_in_date < $3
         AND check_out_date > $2`,
        [number_room, checkin_date, checkout_date]
      );

      if (rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Quarto indisponível para as datas selecionadas"
        });
      }

      res.status(200).json({
        success: true,
        message: "Quarto disponível para as datas selecionadas"
      });
    } catch (error) {
      console.error("❌ Erro ao verificar disponibilidade:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor"
      });
    }
  },

  // ✅ Check-out de cliente
  checkOutReservation: async (req, res) => {
    const { clientCode } = req.body;

    try {
      const clientResult = await pool.query(
        "SELECT client_id FROM clients WHERE client_code = $1",
        [clientCode]
      );

      if (clientResult.rows.length === 0) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }

      const client_id = clientResult.rows[0].client_id;

      const updateResult = await pool.query(
        `UPDATE reservations
         SET status = 'completed', check_out_date = CURRENT_DATE
         WHERE client_id = $1 AND status = 'confirmed'
         RETURNING *`,
        [client_id]
      );

      if (updateResult.rows.length === 0) {
        return res.status(404).json({ error: "Nenhuma reserva ativa encontrada para check-out" });
      }

      res.status(200).json({ message: "Check-out realizado com sucesso!" });
    } catch (error) {
      console.error("❌ Erro ao processar o check-out:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // ✅ Buscar reserva ativa por código do cliente
  getReservationByClientCode: async (req, res) => {
    const { clientCode } = req.params;

    try {
      const clientResult = await pool.query(
        "SELECT * FROM clients WHERE client_code = $1",
        [clientCode]
      );

      if (clientResult.rows.length === 0) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      const client_id = clientResult.rows[0].client_id;

      const reservationResult = await pool.query(
        `SELECT * FROM reservations
         WHERE client_id = $1 AND status = 'confirmed'
         ORDER BY reservation_id DESC
         LIMIT 1`,
        [client_id]
      );

      if (reservationResult.rows.length === 0) {
        return res.status(404).json({ message: "Reserva não encontrada" });
      }

      const companionsResult = await pool.query(
        `SELECT name FROM companions WHERE reservation_id = $1`,
        [reservationResult.rows[0].reservation_id]
      );

      const formatDate = (date) => {
        const d = new Date(date);
        const offset = d.getTimezoneOffset(); // corrigir fuso
        d.setMinutes(d.getMinutes() - offset);
        return d.toISOString().split('T')[0];
      };
      
      res.json({
        client: clientResult.rows[0],
        roomNumber: reservationResult.rows[0].number_room,
        checkInDate: formatDate(reservationResult.rows[0].check_in_date),
        companions: companionsResult.rows
      });

    } catch (error) {
      console.error("❌ Erro ao buscar reserva:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
