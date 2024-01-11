import logo from './logo.svg';
import Login from './pages/login'
import Signup from './pages/signup'
import LoginManual from './pages/login_manual'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login_manual" element={<LoginManual />} />
      </Routes>
    </Router>
  );
}

export default App;
