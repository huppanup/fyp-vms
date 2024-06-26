import Signup from './pages/signup'
import Login from './pages/login'
import Home from './pages/home'
import Cloud from './pages/cloud'
import Map from './pages/map'
import PersonalInfo from "./pages/PersonalInfo"
import AddVenue from "./pages/addvenue"

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
            <VenueProvider>
            <NavBar />
            <Outlet />
            </VenueProvider>
          </div>
        )}>
          <Route path="home" element={<Home />} />
          <Route path="home/add" element={<AddVenue />} />
          <Route element={(
            <div id="content" style={{display:"flex", flexDirection:"column", width: "100%", height:"100vh", maxHeight:"100vh", maxWidth:"100%"}}>
            <Header />
            <Outlet />
            </div>
        )}>
          <Route path="cloud" element={<Cloud />} />
          <Route path="map" element={<Map />} />
          <Route path="dev" element={<Dev />} />
          </Route>
          <Route path="personal-info" element={<PersonalInfo />} />
          
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
