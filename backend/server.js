require("dotenv").config();// Carrega as variáveis do arquivo .env

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Pool } = require('pg');
const { hashPassword, comparePassword } = require('./authUtils.js'); // Importa as funções

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configuração do PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Rota de exemplo para testar o backend
app.get("/api/login", (req, res) => {
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

// Rota para cadastrar um usuário
app.post('/api/usuarios', async (req, res) => {
  const { email, senha, confirmarSenha } = req.body;

  // Validação do email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  if (!validarEmail(email)) {
    return res.status(400).json({ message: 'Insira um email válido' });
  }

  try {
    // Verifica se o email já está cadastrado
    const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Validação da senha
    const validarSenha = (senha) => {
      return senha.length >= 8 && senha.length <= 16; // Verifica se a senha tem entre 8 e 16 caracteres
    };

    if (!validarSenha(senha)) {
      return res.status(400).json({ message: 'A senha deve ter entre 8 e 16 caracteres' });
    }

    // Verifica se as senhas coincidem
    if (senha !== confirmarSenha) {
      return res.status(400).json({ message: 'As senhas não coincidem' });
    }

    // Gera o hash da senha
    const senhaHash = await hashPassword(senha);

    // Insere o usuário no banco de dados
    const { rows } = await pool.query(
      'INSERT INTO usuarios (email, senha) VALUES ($1, $2) RETURNING *',
      [email, senhaHash]
    );

    res.status(201).json({ message: 'Usuário cadastrado com sucesso', usuario: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
});

// Rota para fazer login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca o usuário pelo email
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (rows.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const usuario = rows[0];

    // Compara a senha fornecida com o hash armazenado
    const senhaValida = await comparePassword(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).send('Senha incorreta');
    }

    // Se a senha estiver correta, retorna o usuário (ou um token JWT, por exemplo)
    res.json({ message: 'Login bem-sucedido', usuario });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao fazer login');
  }
});

//Buscar cliente pelo código
app.get('/clientes/:clientCode', async (req, res) => {
  const { clientCode } = req.params;
  try {
      const result = await pool.query('SELECT * FROM clientes WHERE ClientCode = $1', [clientCode]);
      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Cliente não encontrado' });
      }
      res.json(result.rows[0]);
  } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

//Buscar acompanhante pelo código
app.get('/companions/:companionCode', async (req, res) => {
  const { companionCode } = req.params;
  try {
      const result = await pool.query('SELECT * FROM acompanhantes WHERE id = $1', [companionCode]);
      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Acompanhante não encontrado' });
      }
      res.json(result.rows[0]);
  } catch (error) {
      console.error('Erro ao buscar acompanhante:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

//Realizar check-in
app.post('/checkin', async (req, res) => {
  const { clientCode, roomNumber, checkInDate, numberOfPeople, companions } = req.body;

  try {
      // Inserir check-in no banco
      const result = await pool.query(
          'INSERT INTO checkins (client_code, room_number, checkin_date, num_people) VALUES ($1, $2, $3, $4) RETURNING id',
          [clientCode, roomNumber, checkInDate, numberOfPeople]
      );

      const checkInId = result.rows[0].id;

      // Inserir acompanhantes, se houver
      for (const companion of companions) {
          await pool.query(
              'INSERT INTO checkin_companions (checkin_id, companion_code) VALUES ($1, $2)',
              [checkInId, companion.code]
          );
      }

      res.status(201).json({ message: 'Check-in realizado com sucesso!' });
  } catch (error) {
      console.error('Erro ao realizar check-in:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

