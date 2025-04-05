import React, { useState } from "react";
import axios from "axios"; 
import { useNavigate } from 'react-router-dom';
import styles from "./RoomUpdate.module.css";

const RoomUpdate = () => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState("number_room"); 
    const [searchTerm, setSearchTerm] = useState("");
    const [roomDetails, setRoomDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const api = axios.create({
        baseURL: "http://localhost:5000/api",
        timeout: 10000
    });

    const roomOptions = [
        "Double Bed", "Twin Bed", "Garden View", "Beach View", "Lake View",
        "Bathroom with Bathtub", "Living Area", "Cable TV", "Wireless Internet",
        "Hair Dryer", "In-room Safe", "Non-Smoking"
    ];

    const fetchRoomData = async () => {
        if (!searchTerm.trim()) {
            setError("Please enter a search term");
            return;
        }

        setLoading(true);
        setError("");
        setRoomDetails(null);

        try {
            const params = new URLSearchParams();
            searchType === "number_room"
                ? params.append("number_room", searchTerm)
                : params.append("name", searchTerm);

            const response = await api.get(`/rooms/search?${params.toString()}`);
            if (response.data.data?.length > 0) {
                setRoomDetails({
                    ...response.data.data[0],
                    options: response.data.data[0].options || []
                });
            } else {
                setError("No rooms found matching your criteria");
            }
        } catch (err) {
            console.error("Search error details:", {
                url: err.config?.url,
                status: err.response?.status,
                data: err.response?.data
            });
            setError(err.response?.data?.message || "Error searching for room. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails({ ...roomDetails, [name]: value });
    };

    const handleOptionChange = (option) => {
        setRoomDetails((prevState) => {
            const options = prevState.options.includes(option)
                ? prevState.options.filter((opt) => opt !== option)
                : [...prevState.options, option];
            return { ...prevState, options };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!roomDetails?.number_room) {
            setError("No room selected for update");
            return;
        }

        if (roomDetails.beds < 1 || roomDetails.size < 1) {
            setError("Number of beds and room size must be positive values");
            return;
        }

        if (roomDetails.name.length < 3) {
            setError("Room name must be at least 3 characters long");
            return;
        }

        if (roomDetails.options.length === 0) {
            setError("Please select at least one room option");
            return;
        }

        setLoading(true);
        setError("");

        api.put(`/rooms/${roomDetails.number_room}`, roomDetails)
            .then(() => {
                alert("Room updated successfully!");
            })
            .catch((err) => {
                console.error("Update error:", err);
                setError(err.response?.data?.message || "Error updating the room");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className={styles.container}>
            <button 
            onClick={() => navigate('/MainMenu')} 
            className={styles.backButtonUpdate}
            >
            &larr; Menu
          </button>

            <h1 className={styles.title}>Update Room</h1>

            <div className={styles.searchContainer}>
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className={styles.input}
                >
                    <option value="number_room">Room Number</option>
                    <option value="name">Room Name</option>
                </select>

                <input
                    type="text"
                    placeholder={`Enter ${searchType === "number_room" ? "room number" : "room name"}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.input}
                    autoComplete="off"
                />

                <button 
                    onClick={fetchRoomData} 
                    className={styles.button}
                    disabled={loading || !searchTerm.trim()}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            {roomDetails && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    {[
                        { label: "Room Number", name: "number_room", type: "text", readOnly: true },
                        { label: "Room Name", name: "name", type: "text" },
                        { label: "Number of Beds", name: "beds", type: "number", min: 1 },
                        { label: "Room Size (m²)", name: "size", type: "number", min: 1 }
                    ].map(({ label, name, type, min, readOnly }) => (
                        <div key={name} className={styles.formGroup}>
                            <label className={styles.label}>{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={roomDetails[name] || ""}
                                onChange={handleInputChange}
                                required
                                className={styles.input}
                                autoComplete="off"
                                min={min}
                                readOnly={readOnly}
                            />
                        </div>
                    ))}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Room Type</label>
                        <input
                            type="text"
                            name="type_room"
                            value={roomDetails.type_room || ""}
                            onChange={handleInputChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Room Category</label>
                        <input
                            type="text"
                            name="category_room"
                            value={roomDetails.category_room || ""}
                            onChange={handleInputChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Room Options:</label>
                        <div className={styles.checkboxGroup}>
                            {roomOptions.map((option) => (
                                <label key={option} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={roomDetails.options?.includes(option) || false}
                                        onChange={() => handleOptionChange(option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.updateButton}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Room"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default RoomUpdate;
