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
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDocument = (document) => {
    const documentRegex = /^[a-zA-Z0-9-]+$/;
    return documentRegex.test(document);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]+$/; 
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrorMessage(''); 
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
<<<<<<< HEAD

    if (!validateEmail(formData.email)) {
      setErrorMessage('Invalid email format');
      return;
    }

    if (!validateDocument(formData.document)) {
      setErrorMessage('Document must contain only numbers and be at least 8 digits long');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setErrorMessage('Phone number must contain only numbers');
      return;
    }
=======
    if (!validateForm()) return;  // Valida os dados antes de submeter
>>>>>>> 6eac6a72e598e6c7e53d05e5d8880b890203d6c9

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
<<<<<<< HEAD
    <div className="container">
      <h2>Client Registration</h2>
      <form onSubmit={handleSubmit}>

=======
    <div className="user-register-container">
      <h2 className="user-register-title">Client Registration</h2>
      <form onSubmit={handleSubmit} className="user-register-form">
>>>>>>> 6eac6a72e598e6c7e53d05e5d8880b890203d6c9
        <div>
          <label>Client Code:</label>
          <input
            type="text"
            name="client_code"
            placeholder="Auto-generated code"
            value={formData.client_code || 'Generating...'}
            readOnly
          />
        </div>

        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
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
            placeholder="Enter email address"
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
            placeholder="Enter phone number"
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
            placeholder="Enter document (e.g., Passport, ID)"
            value={formData.document}
            onChange={handleChange}
            required
          />
        </div>
<<<<<<< HEAD

        <button type="submit">Register</button>
=======
        <button type="submit" className="user-register-button">Register</button>
>>>>>>> 6eac6a72e598e6c7e53d05e5d8880b890203d6c9
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Exibe a mensagem de erro */}
    </div>
  );
};

export default ClientRegister;
