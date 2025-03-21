import './App.css';
import Login from './Paginas/Login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecoveryLogin from './Paginas/Login/RecoveryLogin/RecoveryLogin';
import CheckOut from './Paginas/Check-In & Check-Out/CheckOut/CheckOut';
import CheckIn from './Paginas/Check-In & Check-Out/CheckIn/CheckIn';
import ClientRegister from './Paginas/Accommodation/ClientRegister/ClientRegister';
import UserUpdate from './Paginas/Accommodation/UserUpdate/UserUpdate';
import SearchUser from './Paginas/Accommodation/SearchUser/SearchUser';
import MainMenu from './Paginas/MainMenu/MainMenu';
import RoomRegistration from './Paginas/Accommodation/RoomRegister/RoomRegistration';
import RoomUpdate from './Paginas/Accommodation/RoomUpdate/RoomUpdate';
import Dashboard from './Paginas/Accommodation/Dashboard/Dashboard';  // Alterei aqui

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/RecoveryLogin" element={<RecoveryLogin/>}/>
        <Route path="/CheckIn" element={<CheckIn/>}/>
        <Route path="/CheckOut" element={<CheckOut/>}/>
        <Route path="/ClientRegister" element={<ClientRegister/>}/>
        <Route path="/UserUpdate" element={<UserUpdate/>}/>
        <Route path="/SearchUser" element={<SearchUser/>}/>
        <Route path="/MainMenu" element={<MainMenu/>}/>
        <Route path="/RoomRegistration" element={<RoomRegistration/>}/>
        <Route path="/RoomUpdate" element={<RoomUpdate/>}/>
        <Route path="/Dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
