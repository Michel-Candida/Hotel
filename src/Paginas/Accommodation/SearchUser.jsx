import React, { useState } from 'react';
import styles from './SearchUser.css';  

const SearchUser = () => {
    const [searchType, setSearchType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setError(''); // Clears any previous errors

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

            setSearchResults(results);
        } catch (err) {
            console.error('Error searching for clients:', err);
            setError('Error searching for clients');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Search Client</h1>
            <select className={styles.selectInput} value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="">Select search type</option>
                <option value="name">Name</option>
                <option value="document">Document</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
            </select>
            {searchType && (
                <div>
                    <input
                        className={styles.textInput}
                        type="text"
                        placeholder={`Enter the ${searchType}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className={styles.button} onClick={handleSearch}>Search</button>
                </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            <div>
                {searchResults.length > 0 ? (
                    <ul className={styles.resultsList}>
                        {searchResults.map((user) => (
                            <li key={user.id} className={styles.resultItem}>
                                ID: {user.id} - Name: {user.name} - Document: {user.document} - Phone: {user.phone} - Email: {user.email}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.resultsText}>No client found</p>
                )}
            </div>
        </div>
    );
};

export default SearchUser;