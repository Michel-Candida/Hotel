import React, { useState, useCallback, useMemo } from 'react';
import './UserCreate.css';

const UserCreate = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', password: '' });

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
    }, []);

    const handleAddUser = useCallback(() => {
        if (Object.values(newUser).every((field) => field.trim() !== '')) {
            setUsers((prevUsers) => [...prevUsers, { ...newUser, id: Date.now() }]);
            setNewUser({ name: '', password: '' });
        }
    }, [newUser]);

    const handleDeleteUser = useCallback((id) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    }, []);

    const userList = useMemo(() => (
        users.length === 0 ? (
            <p>No users registered.</p>
        ) : (
            <ul>
                {users.map(({ id, name }) => (
                    <li key={id} className="user-item">
                        <strong>Name:</strong> {name}
                        <button onClick={() => handleDeleteUser(id)} className="delete-button">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        )
    ), [users, handleDeleteUser]);

    return (
        <div className="container">
            <h1>User Registration</h1>
            <div className="form-container">
                <h2>Create New User</h2>
                {['name', 'password'].map((field) => (
                    <input
                        key={field}
                        type={field === 'password' ? 'password' : 'text'}
                        name={field}
                        placeholder={field === 'name' ? 'User Name' : 'User Password'} 
                        value={newUser[field]}
                        onChange={handleInputChange}
                        className="input-field"
                    />
                ))}
                <button onClick={handleAddUser} className="add-button">Add User</button>
            </div>
            <div className="user-list">
                <h2>User List</h2>
                {userList}
            </div>
        </div>
    );
};

export default UserCreate;
