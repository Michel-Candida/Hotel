import './App.css';
import Login from './Paginas/Login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecoveryLogin from './Paginas/Login/RecoveryLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/recoverylogin" element={<RecoveryLogin/>}/>
      </Routes>
      </Router>
  );
}

export default App;
