import React from 'react';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ImageOverlay } from 'react-leaflet'
import "../stylesheets/map.css";
import { ReactSVG } from "react-svg";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useLocation } from "react-router-dom";
import Dropdown from "react-dropdown";

import 'leaflet/dist/leaflet.css'
import VenueData from '../VenueDataHandler';
import ConstraintMenu from '../components/ConstraintMenu';
import FloorplanMenu from '../components/FloorplanMenu';
import { LatLngBounds } from 'leaflet';

export default () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [constTab, setConstTab] = React.useState(true);
  const [venueInfo, setVenueInfo] = React.useState();
  const [selectedFloor, setSelectedFloor] = React.useState();

  const location = useLocation();
  const currentVenue = new VenueData(location.pathname.split('/').pop());

  const imageStyle = {
    transform: 'rotate(90deg)'
  };

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
          <MapContainer center={[22.3375, 114.2655]} zoom={18} scrollWheelZoom={true} style={{ height:"100%", width:"100%"}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ImageOverlay
              url="https://firebasestorage.googleapis.com/v0/b/fyp-vms-4c56e.appspot.com/o/HKUST_fusion%2Fmap%2F1F%2Fmap.jpg?alt=media&token=3337fa8e-8e46-4740-a71a-a80f9dccbd65"
              bounds={new LatLngBounds([22.3355, 114.2625], [22.4375, 114.3655])}
              opacity={1}
              zIndex={10}
              style={imageStyle}
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