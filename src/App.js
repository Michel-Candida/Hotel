import './App.css';
import Login from './Paginas/Login/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
      </Routes>
      </Router>
  );
}

export default App;
