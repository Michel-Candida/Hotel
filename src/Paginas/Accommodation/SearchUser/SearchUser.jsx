import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchUser.css';

const ClientSearch = () => {
    const [searchType, setSearchType] = useState('name');
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // Histórico comentado para implementação futura
    // const [searchHistory, setSearchHistory] = useState([]);

    /* Histórico comentado
    useEffect(() => {
        const savedHistory = localStorage.getItem('clientSearchHistory');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }
    }, []);
    */

    const searchClients = async () => {
        if (!searchTerm.trim()) {
            setError('Por favor, digite um termo para buscar');
            return;
        }

        setIsLoading(true);
        setError('');
        setResults([]);

        try {
            const response = await fetch(
                `http://localhost:5000/api/clients/search?${searchType}=${encodeURIComponent(searchTerm)}`
            );
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro na busca');
            }

            if (!data.success) {
                setError(data.message);
                return;
            }

            setResults(data.data);
            
            /* Histórico comentado
            const newSearch = {
                type: searchType,
                term: searchTerm,
                when: new Date().toLocaleString(),
                results: data.data.length
            };

            setSearchHistory(prev => {
                const updated = [newSearch, ...prev.filter(item => 
                    !(item.type === searchType && item.term === searchTerm)
                )].slice(0, 10);
                localStorage.setItem('clientSearchHistory', JSON.stringify(updated));
                return updated;
            });
            */

        } catch (err) {
            console.error("Search error:", err);
            setError(err.message || 'Erro ao buscar clientes');
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
                    className="back-button"
                >
                    &larr; Menu
                </button>
                <h2>Search Client</h2>
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
                    disabled={isLoading}
                    className="search-button"
                >
                    {isLoading ? (
                        <span className="loading-spinner"></span>
                    ) : (
                        'Buscar'
                    )}
                </button>
            </div>
            
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    {error.includes("Nenhum cliente encontrado") && (
                        <button 
                            className="clear-search"
                            onClick={() => setSearchTerm('')}
                        >
                            Limpar busca
                        </button>
                    )}
                </div>
            )}
            
            {/* Seção de histórico comentada
            {searchHistory.length > 0 && (
                <div className="search-history">
                    <h3>Histórico de Buscas:</h3>
                    <ul>
                        {searchHistory.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => {
                                        setSearchType(item.type);
                                        setSearchTerm(item.term);
                                        searchClients();
                                    }}
                                    className="history-item"
                                >
                                    <span className="history-type">{item.type}:</span>
                                    <span className="history-term">{item.term}</span>
                                    <span className="history-meta">
                                        {item.results} resultado(s) • {item.when}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            */}
            
            <div className="results-container">
                {results.length > 0 ? (
                    <>
                        <div className="results-summary">
                            <p>{results.length} cliente(s) encontrado(s)</p>
                        </div>
                        
                        <div className="client-cards">
                            {results.map(client => (
                                <div key={client.client_id} className="client-card">
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