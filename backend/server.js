require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rota de exemplo para testar o backend
app.get("/", (req, res) => {
  res.json({ message: "Backend do hotel funcionando!" });
});

// Rota para buscar dados de exemplo usando Axios
app.get("/api/dados", async (req, res) => {
  try {
    const resposta = await axios.get("https://jsonplaceholder.typicode.com/posts");
    res.json(resposta.data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
