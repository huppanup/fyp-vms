import logo from './logo.svg';
import Main from './pages/main'
import Signup from './pages/signup'
import Login from './pages/login'
import Verified from './pages/verified'
import Home from './pages/home'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="signup/verified" element={<Verified />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
