import React from "react";
import "../stylesheets/navbar.css";
import logo from "./logo.jpeg";
import * as icons from "react-icons/fa6";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaCloud, FaCode } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import firebase from 'firebase/compat/app';
import {app, auth, db} from '../firebase';
import {useAuth} from '../AuthContext'
import Dropdown from "./Dropdown";

export default () => {
    const {logout} = useAuth();
    const location = useLocation();
    const [isSettings, setIsSettings] = useState(false);
    const navigate = useNavigate();
    const isCurrentLink = (link) => {
        return location.pathname.includes(link);
    }

    useEffect(() => {
        if (isSettings){
            const handleClickOutside = (event) => {
                if (!document.querySelector("#settings").contains(event.target))setIsSettings(false);
            }; 
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            }
        }
    },[isSettings]);

    return (
        <div className="nav">
            <div className="top-bar">
            <div>
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className={`nav-box ${isCurrentLink('/home') ? 'active' : ''}`}>
                <Link to="/home" className={"nav-item"}>
                    <div style={{ margin: '0 10px', alignItems: 'center'}}>
                        <icons.FaHouseChimney size={25} color="white" />
                    </div>
                </Link>
            </div>
            <div className={`nav-box ${isCurrentLink('/map') ? 'active' : ''}`}>
                <Link to="/map" className="nav-item">
                    <div style={{ margin: '0 10px' }}>
                        <FaMapMarkedAlt size={25} color="white" />
                    </div>
                </Link>
            </div>
            <div className={`nav-box ${isCurrentLink('/cloud') ? 'active' : ''}`}>
                <Link to="/cloud" className="nav-item">
                    <div style={{ margin: '0 10px' }}>
                        <FaCloud size={25} color="white" />
                    </div>
                </Link>
            </div>
            { /*<div className={`nav-box ${isCurrentLink('/dev') ? 'active' : ''}`}>
                <Link to="/dev" className="nav-item">
                    <div style={{ margin: '0 10px' }}>
                        <FaCode size={25} color="white" />
                    </div>
                </Link>
            </div> */}
            </div>
            <div className="bottom-bar">
            <div className={`nav-box ${isCurrentLink('/personal-info') ? 'active' : ''}`}>
                <div className="nav-item" id="settings" onClick={() => setIsSettings(!isSettings)}>
                    <div style={{ margin: '0 10px' }}>
                        <IoPersonCircle size={25} color="white" />
                    </div>
                    {isSettings && 
                    <ul className={"settings-list"}>
                        <li className="settings-item" key="0" onClick={()=>{navigate('/personal-info'); setIsSettings(false);}}>Personal Info</li>
                        <li className="settings-item" key="1" onClick={logout}>Log Out</li>
                    </ul>
                    }
                </div>
            </div>
            
            </div>
        </div>
    );
};
