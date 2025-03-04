import React, { useState } from 'react';
import './StyleLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const navigate = useNavigate();

  // Função para fazer login no backend
  const fazerLogin = async () => {
    try {
      const response = await axios.post('http://hotel_backend:5000/api/login', {
        email: loginEmail,
        senha: loginSenha,
      });
      setMensagem(`Login bem-sucedido: ${response.data.usuario.email}`);
      navigate('/Inicio'); // Redireciona para a página de dashboard (ou outra página)
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMensagem(error.response.data.message); // Exibe a mensagem de erro do backend
      } else {
        setMensagem('Erro ao fazer login');
      }
    }
  };

  // Função para lidar com o submit do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificação de campos obrigatórios
    if (!loginEmail || !loginSenha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Chama a função para realizar o login
    fazerLogin();
  };


  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="loginEmail">Email:</label>
          <input
            type="email"
            id="loginEmail"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="loginSenha">Senha:</label>
          <input
            type="password"
            id="loginSenha"
            value={loginSenha}
            onChange={(e) => setLoginSenha(e.target.value)}
            required
          />
        </div>
        <button className="Button" type="submit">Entrar</button>
      </form>

      <Link to="/recoverylogin" className="recover-button">
          Esqueceu a senha? 
      </Link>
        
      {mensagem && <p>{mensagem}</p>}

    </div>
  );
};

export default Login;
