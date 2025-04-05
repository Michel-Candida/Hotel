import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchUser.css';

const ClientSearch = () => {
    const [searchType, setSearchType] = useState('name');
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        timeout: 10000
    });

    const searchClients = async () => {
        if (!searchTerm.trim()) {
            setError('Por favor, digite um termo para buscar');
            return;
        }
    
        setIsLoading(true);
        setError('');
        setResults([]);
    
        try {
            // Formato correto para a requisição
            const params = {
                [searchType]: searchType === 'name' ? searchTerm : searchTerm
                // Removi os % do frontend - o backend deve adicionar se necessário
            };
    
            const response = await api.get('/clients/search', { params });
    
            if (!response.data.success) {
                setError(response.data.message || 'Nenhum resultado encontrado');
                return;
            }
    
            setResults(response.data.data || []);
    
        } catch (err) {
            console.error("Erro na busca:", err);
            if (err.response?.status === 404) {
                setError('Endpoint não encontrado. Contate o suporte técnico.');
            } else {
                setError(err.response?.data?.message || 'Erro ao buscar clientes');
            }
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchClients();
        }
    };

    
    return (
        <div className="client-search-container">
            <div className="header-with-back">
                <button 
                    onClick={() => navigate('/MainMenu')} 
                    className="back-button-search"
                >
                    &larr; Menu
                </button>
                <h2>Buscar Clientes</h2>
            </div>

            <div className="search-controls">
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="search-select"
                >
                    <option value="name">Nome</option>
                    <option value="client_code">Código</option>
                    <option value="document">Documento</option>
                    <option value="phone">Telefone</option>
                    <option value="email">E-mail</option>
                </select>
                
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Buscar por ${searchType === 'name' ? 'nome' : searchType}...`}
                    className="search-input"
                />
                
                <button 
                    onClick={searchClients}
                    disabled={isLoading || !searchTerm.trim()}
                    className="search-button"
                >
                    {isLoading ? (
                        <>
                            <span className="loading-spinner"></span>
                            Buscando...
                        </>
                    ) : (
                        'Buscar'
                    )}
                </button>
            </div>
            
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button 
                        className="clear-search"
                        onClick={() => {
                            setSearchTerm('');
                            setError('');
                        }}
                    >
                        Limpar busca
                    </button>
                </div>
            )}
            
            <div className="results-container">
                {results.length > 0 ? (
                    <>
                        <div className="results-summary">
                            <p>{results.length} cliente(s) encontrado(s)</p>
                        </div>
                        
                        <div className="client-cards">
                            {results.map(client => (
                                <div 
                                    key={client.client_code} 
                                    className="client-card"
                                    
                                >
                                    <div className="client-header">
                                        <span className="client-code">{client.client_code}</span>
                                        <span className="client-date">Cadastro: {client.registration_date}</span>
                                    </div>
                                    <h3 className="client-name">{client.name}</h3>
                                    <div className="client-details">
                                        <p><strong>Documento:</strong> {client.document}</p>
                                        <p><strong>Telefone:</strong> {client.phone}</p>
                                        <p><strong>E-mail:</strong> {client.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    !error && !isLoading && (
                        <div className="empty-state">
                            <p>Nenhum resultado para exibir</p>
                            <p>Realize uma busca para ver os clientes cadastrados</p>
                        </div>
                    )
                )}
                
                {isLoading && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Buscando clientes...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientSearch;