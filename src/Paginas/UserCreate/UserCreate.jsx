import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import "./UserCreate.css";

const API_URL = "http://localhost:5000/users"; 

const UserCreate = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", password: "" });

    useEffect(() => {
        axios.get(API_URL)
            .then((response) => setUsers(response.data))
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
                    setUsers((prevUsers) => [...prevUsers, response.data]);
                    setNewUser({ name: "", password: "" });
                })
                .catch((error) => console.error("Error adding user:", error));
        }
    }, [newUser]);

    const handleDeleteUser = useCallback((id) => {
        axios.delete(`${API_URL}/${id}`)
            .then(() => {
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            })
            .catch((error) => console.error("Error deleting user:", error));
    }, []);

    return (
        <div className="container">
            <h1>User Registration</h1>
            <div className="form-container">
                <h2>Create New User</h2>
                {["name", "password"].map((field) => (
                    <input
                        key={field}
                        type={field === "password" ? "password" : "text"}
                        name={field}
                        placeholder={field === "name" ? "User Name" : "User Password"}
                        value={newUser[field]}
                        onChange={handleInputChange}
                        className="input-field"
                        autoComplete="off"
                    />
                ))}
                <button onClick={handleAddUser} className="add-button">
                    Add User
                </button>
            </div>
            <div className="user-list">
                <h2>User List</h2>
                {users.length === 0 ? (
                    <p>No users registered.</p>
                ) : (
                    <ul>
                        {users.map((user) => (
                            <li key={user.id || user.name} className="user-item">
                                <strong>Name:</strong> {user.name}
                                <button onClick={() => handleDeleteUser(user.id)} className="delete-button">
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
