import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClientRegister.css';

const ClientRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document: ''
  });
  const [clientCode, setClientCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Funções de validação
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

  const validateName = (name) => {
    return name.length >= 3 && /^[a-zA-Z\s]+$/.test(name);
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

    if (!validateName(name)) {
      setErrorMessage('Name must contain at least 3 letters and only alphabetic characters');
      return false;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Invalid email format');
      return false;
    }

    if (!validateDocument(document)) {
      setErrorMessage('Document must contain only numbers and hyphens');
      return false;
    }

    if (!validatePhone(phone)) {
      setErrorMessage('Phone number must contain only numbers');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/clients', formData);
      
      if (response.status === 201) {
        setClientCode(response.data.client.client_code);
        setSuccessMessage(response.data.message || 'Client registered successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          document: ''
        });
      }
    } catch (error) {
      console.error('Error registering client:', error);
      
      if (error.response) {
        if (error.response.status === 400) {
          setErrorMessage(error.response.data.message || 'Validation error');
        } else if (error.response.status === 409) {
          setErrorMessage('Document or email already exists');
        } else {
          setErrorMessage('Server error occurred');
        }
      } else if (error.request) {
        setErrorMessage('No response from server. Please try again later.');
      } else {
        setErrorMessage('Error setting up request');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='Main-Container-Register-Client'>
      <div className="user-register-container">
        <div className="header-Register-back">
          <button 
            onClick={() => navigate('/MainMenu')} 
            className="Rc-back-button"
          >
            &larr; Menu
          </button>
          <h2>Client Registration</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="user-register-form">
          {clientCode && (
            <div>
              <label>Client Code:</label>
              <input
                type="text"
                placeholder="Auto-generated code"
                value={clientCode}
                readOnly
                autoComplete="off"
              />
            </div>
          )}

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

          <button 
            type="submit" 
            className="user-register-button"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRegister;