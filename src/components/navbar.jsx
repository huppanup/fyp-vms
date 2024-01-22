import React from "react";
import "../stylesheets/navbar.css";
import logo from "./logo.jpeg";
import { FaHouseChimney } from "react-icons/fa6";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaCloud } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

export default () => {

    const location = useLocation();
    const isCurrentLink = (link) => {
        return location.pathname === link;
    }
    return (
        <>
        <div className="nav">
            <div className="top-bar">
            <div>
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className={`nav-item ${isCurrentLink('/home') ? 'active' : ''}`}>
                <Link to="/home" className={"home"}>
                    <div style={{ margin: '0 10px' }}>
                        <FaHouseChimney size={30} color="white" />
                    </div>
                </Link>
            </div>
            <div className={`nav-item ${isCurrentLink('/map') ? 'active' : ''}`}>
                <Link to="/map" className="map">
                    <div style={{ margin: '0 10px' }}>
                        <FaMapMarkedAlt size={30} color="white" />
                    </div>
                </Link>
            </div>
            <div className={`nav-item ${isCurrentLink('/cloud') ? 'active' : ''}`}>
                <Link to="/cloud" className="cloud">
                    <div style={{ margin: '0 10px' }}>
                        <FaCloud size={30} color="white" />
                    </div>
                </Link>
            </div>
            </div>
            <div className="bottom-bar">
            <div className={`nav-item ${isCurrentLink('/setting') ? 'active' : ''}`}>
                <Link to="/setting" class="setting">
                    <div style={{ margin: '0 10px' }}>
                        <IoSettingsSharp size={30} color="white" />
                    </div>
                </Link>
            </div>
            <div className={`nav-item ${isCurrentLink('/personal-info') ? 'active' : ''}`}>
                <Link to="/personal-info" class="personal-info">
                    <div style={{ margin: '0 10px' }}>
                        <IoPersonCircle size={30} color="white" />
                    </div>
                </Link>
            </div>
            </div>
        </div>
        </>
    );
};
