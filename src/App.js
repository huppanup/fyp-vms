import logo from './logo.svg';
import Signup from './pages/signup'
import Login from './pages/login'
import Home from './pages/home'
import Cloud from './pages/cloud'
import Map from './pages/map'
import NavBar from "./components/navbar";
import Header from "./components/Header"
import Dev from './pages/dev'
import {PrivateRoute} from './PrivateRoute'
import { AuthProvider } from "./AuthContext"
import './App.css';

import React, {useState, useEffect} from "react";
import {app, auth, db} from './firebase';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { VenueProvider } from './LocationContext';

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
          <div style={{display:"flex", maxHeight:"100vh", maxWidth:"100vw"}}>
            <NavBar />
            <Outlet />
          </div>
        )}>
          <Route path="home" element={<Home />} />
          <Route element={(
            <VenueProvider>
            <div id="content" style={{display:"flex", flexDirection:"column", width: "100%", height:"100vh", maxHeight:"100vh", maxWidth:"100%"}}>
            <Header />
            <Outlet />
            </div>
            </VenueProvider>
        )}>
          <Route path="cloud/:location?" element={<Cloud />} />
          <Route path="map/:location?" element={<Map />} />
          <Route path="dev/:location?" element={<Dev />} />
          </Route>
          
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
