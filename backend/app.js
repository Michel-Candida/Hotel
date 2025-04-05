const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Adicione esta linha para importar o axios
const { CORS_ORIGIN } = require('./config/config');

const app = express();

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Health check route
app.get('/api/status', (req, res) => res.json({ message: "Hotel backend is running!" }));

// API Routes
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api', require('./routes/reservationRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
// Example data route (se realmente necessário)
app.get("/api/data", async (req, res) => {
  try {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts");
    res.json(data);
  } catch (error) {
    console.error("Error fetching example data:", error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Error handling middleware (adicione isto para melhor tratamento de erros)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;