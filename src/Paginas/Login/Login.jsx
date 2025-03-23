import React, { useState } from 'react';
import './StyleLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        name: loginName,
        password: loginPassword,
      });

      // Armazenar o token no localStorage ou nas cookies
      localStorage.setItem('token', response.data.token);

      // Redirecionar para o menu principal
      navigate('/MainMenu');
    } catch (error) {
      // Exibir a mensagem de erro personalizada, dependendo da resposta da API
      setMessage(error.response ? error.response.data.message : 'Server error');
    }
  };

  return (
    <div className="Main-container">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="loginName">Name:</label>
            <input
              type="text"
              id="loginName"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">Password:</label>
            <input
              type="password"
              id="loginPassword"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>

          <button className="Button" type="submit">Sign In</button>
        </form>

        <Link to="/recoverylogin" className="recover-button">
          Forgot your password?
        </Link>

   
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
