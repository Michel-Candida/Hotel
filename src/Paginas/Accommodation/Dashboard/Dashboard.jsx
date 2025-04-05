import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
  const [checkedInGuests, setCheckedInGuests] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [reservationsRes, checkedInRes, roomsRes, pendingRes] = await Promise.all([
        axios.get('http://localhost:5000/api/dashboard/reservations'),
        axios.get('http://localhost:5000/api/dashboard/checkedin'),
        axios.get('http://localhost:5000/api/dashboard/rooms'),
        axios.get('http://localhost:5000/api/dashboard/pending-reservations'),
      ]);

      setReservations(reservationsRes.data);
      setCheckedInGuests(checkedInRes.data);
      setAvailableRooms(roomsRes.data); 
      setPendingReservations(pendingRes.data);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  if (loading) {
    return <div className="dashboard-container"><p>Loading data...</p></div>;
  }

    return (
        <div className="dashboard-container">
          <button 
            onClick={() => navigate('/MainMenu')} 
            className="back-buttonDashboard"
          >
            &larr; Menu
          </button>
      
          <h1 className="dashboard-title">Hotel Dashboard</h1>
      
          <div className="dashboard-section">
        <h2>✅ Reservas Confirmadas</h2>
        <ul>
          {reservations.map(res => (
            <li key={res.id}>
              <span>{res.clientName || res.name} - Quarto: {res.roomnumber}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h2>🏨 Hóspedes Hospedados</h2>
        <ul>
          {checkedInGuests.map(guest => (
            <li key={guest.id}>
              <span>
                {guest.name} - Quarto: {guest.roomNumber} | Hóspedes: {guest.total_guests}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h2>🛏️ Quartos Disponíveis</h2>
        <ul>
          {availableRooms.map(room => (
            <li key={room.id}>
              <span>Quarto {room.number_room} - Tipo: {room.type_room}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h2>⏳ Reservas Pendentes</h2>
        <ul>
          {pendingReservations.map(res => (
            <li key={res.id}>
              <span>{res.clientName} - Quarto: {res.roomnumber}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
