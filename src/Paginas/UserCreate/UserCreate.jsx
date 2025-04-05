import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./UserCreate.css";

const API_URL = "http://localhost:5000/api/users";

const UserCreate = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

    useEffect(() => {
        axios.get(API_URL)
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error("Unexpected data format:", response.data);
                }
            })
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
    }, []);

    const handleAddUser = useCallback(() => {
        if (Object.values(newUser).every((field) => field.trim() !== "")) {
            axios.post(API_URL, newUser)
                .then((response) => {
                    if (response.data && response.data.user) {
                        setUsers((prevUsers) => [...prevUsers, response.data.user]);
                        setNewUser({ name: "", email: "", password: "" });
                    }
                })
                .catch((error) => console.error("Error adding user:", error));
        }
    }, [newUser]);

    const handleDeleteUser = useCallback((id) => {
        axios.delete(`${API_URL}/${id}`)
            .then(() => {
                setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== id));
            })
            .catch((error) => console.error("Error deleting user:", error));
    }, []);

    return (
        <div className="container">
            <h1>User Registration</h1>
            <div className="form-container">
                <h2>Create New User</h2>

                {["name", "email", "password"].map((field) => (
                    <input
                        key={field}
                        type={field === "password" ? "password" : "text"}
                        name={field}
                        placeholder={
                            field === "name" ? "User Name" :
                            field === "email" ? "Email" :
                            "Password"
                        }
                        value={newUser[field]}
                        onChange={handleInputChange}
                        className="input-field"
                        autoComplete="off"
                    />
                ))}

                <button onClick={handleAddUser} className="add-button">Add User</button>

                <button onClick={() => navigate('/MainMenu')} className="back-buttonCreate">
                    &larr; Menu
                </button>
            </div>

            <div className="user-list">
                <h2>User List</h2>
                {users.length === 0 ? (
                    <p>No users registered.</p>
                ) : (
                    <ul>
                        {users.map((user) => (
                            <li key={user.user_id} className="user-item">
                                <strong>Name:</strong> {user.name}
                                <button onClick={() => handleDeleteUser(user.user_id)} className="delete-button">
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserCreate;
