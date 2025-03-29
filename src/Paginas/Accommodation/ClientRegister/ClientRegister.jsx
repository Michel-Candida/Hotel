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
  const [successMessage, setSuccessMessage] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:5000',
  });

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
    setSuccessMessage('');
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

    setErrorMessage('');
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }
  
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
  
    try {
      const response = await api.post('/clients', formData);
      if (response.status === 201) {
        setFormData((prevData) => ({
          ...prevData,
          client_code: response.data.client.client_code
        }));
        setSuccessMessage('Client registered successfully!');
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
            placeholder="Auto-generated code"
            value={formData.client_code || 'Generating...'}
            readOnly
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
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
            autoComplete="off"
          />
        </div>
        <button type="submit" className="user-register-button">Register</button>
      </form>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default ClientRegister;