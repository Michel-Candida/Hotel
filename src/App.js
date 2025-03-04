import './App.css';
import Login from './Paginas/Login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecoveryLogin from './Paginas/Login/RecoveryLogin';
import CheckOut from './Paginas/Check-In & Check-Out/CheckOut';
import CheckIn from './Paginas/Check-In & Check-Out/CheckIn';
import UserRegister from './Paginas/Accommodation/UserRegister';
import UserUpdate from './Paginas/Accommodation/UserUpdate';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/RecoveryLogin" element={<RecoveryLogin/>}/>
        <Route path="/CheckIn" element={<CheckIn/>}/>
        <Route path="/CheckOut" element={<CheckOut/>}/>
        <Route path="/UserRegister" element={<UserRegister/>}/>
        <Route path="/UserUpdate" element={<UserUpdate/>}/>
      </Routes>
      </Router>
  );
}

export default App;
