import React from 'react';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import "../stylesheets/map.css";
import { ReactSVG } from "react-svg";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useSearchParams } from "react-router-dom";
import 'leaflet/dist/leaflet.css'
import ConstraintMenu from '../components/ConstraintMenu';
import FloorplanMenu from '../components/FloorplanMenu';

export default () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [constTab, setConstTab] = React.useState(true);
  const [currentV, setCurrentV] = React.useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  

  useEffect(() => {
    console.log("Current V : " + currentV);
    setSearchParams({["id"]: currentV});
  },[currentV]);
  
  return (
    <>
    <div className="main-container">
        <div className="map-main-panel" >
        <div style={{display:"flex", height:"100%", flexDirection:"row",zIndex:"100"}}>
        <Sidebar className="sideBar" height={"100%"} width={"350px"} collapsed={collapsed} collapsedWidth={"0px"} >
          <Menu>
            <SubMenu label="Floor">
              <MenuItem> G </MenuItem>
              <MenuItem> LG1 </MenuItem>
            </SubMenu>
            <button onClick={()=> setCurrentV("HKUST_fusion")}>CHANGE VENUE</button>
            <nav className="tabNav">
              <ul className={constTab ? "selected" : ""} onClick={() => setConstTab(!constTab)}><a>Constraints</a></ul>
              <ul className={!constTab ? "selected" : ""} onClick={() => setConstTab(!constTab)}><a>Floor Plan</a></ul>
            </nav>
            {constTab ? <ConstraintMenu /> : <FloorplanMenu />}
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