import React from 'react';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ImageOverlay } from 'react-leaflet'
import { ReactSVG } from "react-svg";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar"
import 'leaflet/dist/leaflet.css'
import '../stylesheets/map.css'
import VenueData from '../VenueDataHandler';
import { LatLngBounds } from 'leaflet';
import { useVenue } from '../LocationContext';

export default () => {

  const { venueID, floor, setVenue, setSelectedFloor, venueInfo, dataHandler } = useVenue();

  const [collapse, setCollapse] = React.useState(false);

  const location = useLocation();

  const imageStyle = {
    transform: 'rotate(90deg)'
  };

  useEffect(() => {
    setVenue("-NrisipFr0yx32oaNHQz");
  }, [venueID]);
  

  const styles = { display: "flex", position: "relative", height: "calc(100vh - 100px)", transition: "margin-left 1s ease"};

  
  return (
    <>
    <div className="main-container">
    <Sidebar collapse={collapse} setCollapse={setCollapse} />
        <div className="map-main-panel" style={{zIndex:"0"}}>
          <div id="mapWrap">
            <div id="mapContainer">
              <MapContainer center={[22.3375, 114.2655]} zoom={18} scrollWheelZoom={true} style={{ height:"100%", width:"100%"}}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ImageOverlay
                  url="https://firebasestorage.googleapis.com/v0/b/fyp-vms-4c56e.appspot.com/o/HKUST_fusion%2Fmap%2F1F%2Fmap.jpg?alt=media&token=3337fa8e-8e46-4740-a71a-a80f9dccbd65"
                  bounds={new LatLngBounds([22.3355, 114.2625], [22.3375, 114.2655])}
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