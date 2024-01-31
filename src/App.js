import logo from './logo.svg';
import Signup from './pages/signup'
import Login from './pages/login'
import Home from './pages/home'
import Cloud from './pages/cloud'
import Map from './pages/map'
import NavBar from "./components/navbar";
import {PrivateRoute} from './PrivateRoute'
import { AuthProvider } from "./AuthContext"
import './App.css';

import React, {useState, useEffect} from "react";
import {app, auth, db} from './firebase';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route element={<PrivateRoute/> }>
          <Route exact path="/" element={<Navigate to="/home" />} />
        </Route>
        <Route element={<PrivateRoute/> }>
        <Route element={(
              <>
                <NavBar />
                <Outlet />
              </>
            )}>
            <Route path="home" element={<Home />} />
            <Route path="cloud" element={<Cloud />} />
            <Route path="map" element={<Map />} />
        </Route>
        </Route>
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
      </Routes>
      </AuthProvider>
    </Router>
  );
  
}

export default App;
