import React, { useState } from 'react';
import './SearchUser.css';  

const SearchUser = () => {
    const [searchType, setSearchType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setError(''); // Limpar erro antes de buscar

        // Validações para garantir que os dados inseridos estão corretos
        if (searchType === 'name' && !/^[a-zA-Z\sÀ-ÖØ-öø-ÿ]+$/.test(searchTerm)) {
            setError('Name should contain only letters, spaces, and accents.');
            return;
        }
        if (searchType === 'document' && !/^[0-9.\-]+$/.test(searchTerm)) {
            setError('Document should contain only numbers, dots, and dashes.');
            return;
        }
        if (searchType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchTerm)) {
            setError('Invalid email.');
            return;
        }
        if (searchType === 'phone' && !/^[0-9]+$/.test(searchTerm)) {
            setError('Phone number should contain only numbers.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/search?${searchType}=${searchTerm}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const results = await response.json();

            if (results.length === 0) {
                setSearchResults([]);
                setError('No clients found with the provided information.');
            } else {
                setSearchResults(results);
            }
        } catch (err) {
            console.error('Error searching for clients:', err);
            setError('Error searching for clients');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="search-user-container">
            <div className="search-user-box">
                <h1 className="search-user-title">Search Client</h1>
                <select className="search-user-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="">Select search type</option>
                    <option value="name">Name</option>
                    <option value="document">Document</option>
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                </select>
                {searchType && (
                    <div>
                        <input
                            className="search-user-input"
                            type="text"
                            placeholder={`Enter the ${searchType}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoComplete="off"
                        />
                        <button className="search-user-button" onClick={handleSearch}>Search</button>
                    </div>
                )}
                {error && <p className="search-user-error">{error}</p>}
                <div>
                    {searchResults.length > 0 ? (
                        <ul className="search-user-results-list">
                            {searchResults.map((user) => (
                                <li key={user.id} className="search-user-result-item">
                                    ID: {user.id} - Name: {user.name} - Document: {user.document} - Phone: {user.phone} - Email: {user.email}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !error && <p className="search-user-no-results">No client found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchUser;
