import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './StyleLogin.css';
import RecoveryLogin from './RecoveryLogin';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleForgotPassword = () => {
        alert('Redirecionando para recuperação de senha...');
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        if (username !== 'admin' || password !== 'admin') {
            alert('Usuário ou senha incorretos.');
            return;
        }
        console.log('Usuário:', username);
        console.log('Senha:', password);
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Usuário:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="Button" type="submit">Entrar</button>
            </form>
            <Link to="/RecoveryLogin" className="recover-button">
            Esqueceu a senha?
        </Link>
        </div>
    );
};

export default Login;