import './App.css';
import Login from './Paginas/Login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecoveryLogin from './Paginas/Login/RecoveryLogin';
import CheckOut from './Paginas/Check-In & Check-Out/CheckOut';
import CheckIn from './Paginas/Check-In & Check-Out/CheckIn';
import ClientRegister from './Paginas/Accommodation/ClientRegister';
import UserUpdate from './Paginas/Accommodation/UserUpdate';
import SearchUser from './Paginas/Accommodation/SearchUser';
import MainMenu from './Paginas/MainMenu/MainMenu';

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
      </Routes>
      </Router>
  );
}

export default App;
