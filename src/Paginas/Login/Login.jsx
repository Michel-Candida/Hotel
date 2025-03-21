import React, { useState, useEffect } from 'react';
import './StyleLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Function to handle login in the backend
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://hotel_backend:5000/api/login', {
        email: loginEmail,
        password: loginPassword,
      });

      // Store the token in localStorage after successful login
      localStorage.setItem('token', response.data.token); // Assuming the backend returns a token

      setMessage(`Login successful!`);
      navigate('/MainMenu'); // Redirects to MainMenu page
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message); // Displays the error message from the backend
      } else {
        setMessage('Error logging in');
      }
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for required fields
    if (!loginEmail || !loginPassword) {
      alert('Please fill in all fields.');
      return;
    }

    // Call the login function
    handleLogin();
  };

  // Check if the user is logged in (if a valid token exists in localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/MainMenu'); // If logged in, redirect to MainMenu directly
    }
  }, [navigate]);

  return (
    <div className="Main-container">
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

      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default Login;
