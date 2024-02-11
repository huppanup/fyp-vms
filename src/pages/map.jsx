import React from 'react';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import "../stylesheets/map.css";
import { ReactSVG } from "react-svg";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'leaflet/dist/leaflet.css'

export default () => {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <>
    <div className="main-container">
        <div className="map-main-panel" >
        <div style={{display:"flex",flexDirection:"row",alignItems: "center",zIndex:"100"}}>
        <Sidebar className="sideBar" collapsed={collapsed} collapsedWidth={"0px"} >
          <Menu>
            <SubMenu label="Charts">
              <MenuItem> Pie charts </MenuItem>
              <MenuItem> Line charts </MenuItem>
            </SubMenu>
            <MenuItem> Documentation </MenuItem>
            <MenuItem> Calendar </MenuItem>
          </Menu>
        </Sidebar>
        <ReactSVG onClick={() => setCollapsed(!collapsed)}src='./tab.svg' style={{width:"50px", zIndex: "100"}}>SVG AREA</ReactSVG>
        </div>
        <div id="mapWrap">
        <div id="mapContainer">
          <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} style={{ height:"100vh", width:"100%"}}>
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