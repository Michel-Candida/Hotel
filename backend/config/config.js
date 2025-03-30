require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'secret_key',
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000"
};