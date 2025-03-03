import React, { useState } from 'react';
import './StyleLogin.css';

const RecoveryLogin = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica para enviar o email de recuperação
        console.log('Email para recuperação enviado para:', email);
    };

    return (
        <div>
            <h2>Redefinir Senha</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default RecoveryLogin;