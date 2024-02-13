import React from "react";
import "../stylesheets/navbar.css";
import logo from "./logo.jpeg";
import { FaHouseChimney } from "react-icons/fa6";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaCloud, FaCode } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

import firebase from 'firebase/compat/app';
import {app, auth, db} from '../firebase';
import {useAuth} from '../AuthContext'

export default () => {
    const {logout} = useAuth();
    const location = useLocation();
    const isCurrentLink = (link) => {
        return location.pathname.includes(link);
    }

    return (
        <>
        <div className="nav" style = {{position: "absolute", x: 0}}>
            <div className="top-bar">
            <div>
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className={`nav-box ${isCurrentLink('/home') ? 'active' : ''}`}>
                <Link to="/home" className={"nav-item"}>
                    <div style={{ margin: '0 10px', alignItems: 'center'}}>
                        <FaHouseChimney size={25} color="white" />
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
            <div className={`nav-box ${isCurrentLink('/dev') ? 'active' : ''}`}>
                <Link to="/dev" className="nav-item">
                    <div style={{ margin: '0 10px' }}>
                        <FaCode size={25} color="white" />
                    </div>
                </Link>
            </div>
            </div>
            <div className="bottom-bar">
            <div className={`nav-item ${isCurrentLink('/personal-info') ? 'active' : ''}`}>
                <Link to="/personal-info" className="personal-info">
                    <div style={{ margin: '0 10px' }}>
                        <IoPersonCircle size={25} color="white" />
                    </div>
                </Link>
            </div>

            {/* TEMPORARY!! */}
            <button onClick={logout}>
                SIGN OUT
            </button>
            </div>
        </div>
        </>
    );
};
