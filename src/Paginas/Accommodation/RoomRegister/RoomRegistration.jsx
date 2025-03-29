import React, { useState, useEffect } from "react";
import styles from "./RoomRegistration.module.css";
import axios from "axios";

const RoomRegistration = () => {
    const [roomDetails, setRoomDetails] = useState({
        number_room: "",
        name: "",
        type_room: "",
        category_room: "",
        beds: "",
        size: "",
        options: [],
    });
    
    const roomTypes = ["Single room", "Double room", "Triple room", "Quadruple room"];
    const roomCategories = ["Main house", "Garden", "Tower 1", "Tower 2"];
    const roomOptions = [
        "Double Bed",
        "Twin Bed",
        "Garden View",
        "Beach View",
        "Lake View",
        "Bathroom with Bathtub",
        "Living Area",
        "Cable TV",
        "Wireless Internet",
        "Hair Dryer",
        "In-room Safe",
        "Non-Smoking",
    ];

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
 
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (roomDetails.name.length < 3) {
          alert("Room name must be at least 3 characters long.");
          return;
        }
      
        if (!roomDetails.number_room) {
          alert("Please enter a room number.");
          return;
        }
      
        if (roomDetails.beds < 1 || roomDetails.size < 1) {
          alert("Number of beds and room size must be positive values.");
          return;
        }
      
        if (roomDetails.options.length === 0) {
          alert("Please select at least one room option.");
          return;
        }
      
        try {
          const response = await axios.post("http://localhost:5000/rooms", roomDetails);
          alert(`Room registered successfully! Room Number: ${response.data.room.number_room}`);
          setRoomDetails({
            number_room: "",
            name: "",
            type_room: "",
            category_room: "",
            beds: "",
            size: "",
            options: [],
          });
        } catch (error) {
          console.error(error);
          alert("Error registering room: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Room Registration</h1>
            <form onSubmit={handleSubmit}>
                {[ 
                    { label: "Room Number", name: "number_room", type: "text" },
                    { label: "Room Name", name: "name", type: "text" },
                    { label: "Number of Beds", name: "beds", type: "number" },
                    { label: "Room Size (m²)", name: "size", type: "number" },
                ].map(({ label, name, type }) => (
                    <div key={name} className={styles.formGroup}>
                        <label className={styles.label}>{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={roomDetails[name]}
                            onChange={handleInputChange}
                            required
                            className={styles.input}
                            autoComplete="off"
                            min={type === "number" ? "1" : undefined}
                        />
                    </div>
                ))}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Type of Room</label>
                        <select
                            name="type_room"
                            value={roomDetails.type_room}
                            onChange={handleInputChange}
                            className={styles.input}
                            required
                        >
                            <option value="" disabled hidden>Select a room type</option>
                            {roomTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Category of Room</label>
                        <select
                            name="category_room"
                            value={roomDetails.category_room}
                            onChange={handleInputChange}
                            className={styles.input}
                            required
                        >
                            <option value="" disabled hidden>Select a category</option>
                            {roomCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Room Options:</label>
                    <div className={styles.checkboxGroup}>
                        {roomOptions.map((option) => (
                            <label key={option} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={roomDetails.options.includes(option)}
                                    onChange={() => handleOptionChange(option)}
                                    autoComplete="off"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className={styles.button}>Register Room</button>
            </form>
        </div>
    );
};

export default RoomRegistration;