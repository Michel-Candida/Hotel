import React, { useState } from 'react';
import axios from 'axios';
import './ClientRegister.css';

const ClientRegister = () => {
  const [formData, setFormData] = useState({
    client_code: '',
    name: '',
    email: '',
    phone: '',
    document: ''
  });
  const [errorMessage, setErrorMessage] = useState('');  // Estado para mensagem de erro

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrorMessage('');  // Limpar a mensagem de erro ao digitar
  };

  const validateForm = () => {
    const { name, email, phone, document } = formData;
    if (!name || !email || !phone || !document) {
      setErrorMessage('All fields are required!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;  // Valida os dados antes de submeter

    try {
      const response = await axios.post('http://localhost:5000/clients', formData);
      if (response.status === 201) {
        setFormData((prevData) => ({
          ...prevData,
          client_code: response.data.client.client_code
        }));
        alert('Client registered successfully!');
      }
    } catch (error) {
      console.error('Error registering client:', error.response?.data?.message || error);
      setErrorMessage(error.response?.data?.message || 'Error registering client');
    }
  };

  return (
    <div className="user-register-container">
      <h2 className="user-register-title">Client Registration</h2>
      <form onSubmit={handleSubmit} className="user-register-form">
        <div>
          <label>Client Code:</label>
          <input
            type="text"
            name="client_code"
            value={formData.client_code || 'Generating...'}
            readOnly
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Document:</label>
          <input
            type="text"
            name="document"
            value={formData.document}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="user-register-button">Register</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Exibe a mensagem de erro */}
    </div>
  );
};

export default ClientRegister;
