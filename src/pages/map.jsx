import React from 'react';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import "../stylesheets/map.css";
import { ReactSVG } from "react-svg";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useLocation } from "react-router-dom";
import Dropdown from "react-dropdown";

import 'leaflet/dist/leaflet.css'
import VenueData from '../VenueDataHandler';
import ConstraintMenu from '../components/ConstraintMenu';
import FloorplanMenu from '../components/FloorplanMenu';

export default () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [constTab, setConstTab] = React.useState(true);
  const [venueInfo, setVenueInfo] = React.useState();
  const [selectedFloor, setSelectedFloor] = React.useState();

  const location = useLocation();
  const currentVenue = new VenueData(location.pathname.split('/').pop());

  useEffect(() => {
    const curPath = location.pathname.split('/')
    if (curPath.length > 2 && curPath[2] !== "" && curPath[2] !== "undefined" ){
      const newid = location.pathname.split('/').pop();
      currentVenue.id = newid;
      currentVenue.getVenueInfo().then((data) => setVenueInfo(data));
    }
  },[location.pathname]);
  
  return (
    <>
    <div className="main-container">
        <div className="map-main-panel" >
        <div style={{display:"flex", height:"100%", flexDirection:"row",zIndex:"100"}}>
        <Sidebar className="sideBar" max-height={"100%"} width={"350px"} collapsed={collapsed} collapsedWidth={"0px"} >
          <Menu>
          <div className="help" style={{height: "calc(100vh - 100px)"}}>
            <Dropdown className="floor-name" options={venueInfo ? venueInfo.floors : "Loading"} value={selectedFloor}
                onChange={(option) => setSelectedFloor(option.value)}
                placeholder="Floors"
                controlClassName="myControl"
                arrowClassName="myArrow"/>
            <nav className="tabNav">
              <ul className={constTab ? "selected" : ""} onClick={() => setConstTab(!constTab)}><a>Constraints</a></ul>
              <ul className={!constTab ? "selected" : ""} onClick={() => setConstTab(!constTab)}><a>Floor Plan</a></ul>
            </nav>
            {constTab ? <ConstraintMenu currentFloor={selectedFloor}/> : <FloorplanMenu />}
            </div>
          </Menu>
        </Sidebar>
        <ReactSVG onClick={() => setCollapsed(!collapsed)}src='./tab.svg' style={{width:"50px", zIndex: "100"}}>SVG AREA</ReactSVG>
        </div>
        <div id="mapWrap">
        <div id="mapContainer">
          <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} style={{ height:"100%", width:"100%"}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
            </Marker>
          </MapContainer>
        
        </div>
        </div>
        </div>
  </div>
    </>
)  
}