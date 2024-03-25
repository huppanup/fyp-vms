import React from 'react';
import { useEffect, useState } from 'react';
import { ReactSVG } from "react-svg";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar"
import 'leaflet/dist/leaflet.css'
import '../stylesheets/map.css'
import VenueData from '../VenueDataHandler';
import { useVenue } from '../LocationContext';
import { addFloorPlanImage, initializeMap, removeMap } from '../leaflet';

export default () => {

  const { venueID, floor, setVenue, setSelectedFloor, venueInfo, dataHandler } = useVenue();

  const [collapse, setCollapse] = React.useState(false);
  const [floorInfo, setFloorInfo] = React.useState();
  const [map, setMap] = React.useState(null);

  const location = useLocation();

  const imageStyle = {
    transform: 'rotate(90deg)'
  };

  useEffect(() => {
    let map = initializeMap();
    setMap(map);
    if (floor) {
      dataHandler.getFloorInfo(venueID, floor).then(data => {
        setFloorInfo(data);
        addFloorPlanImage(map, data["floorplan"], data["settings"]["transformation"], data["imageHeight"], data["imageWidth"]);
      });
    }
  }, [venueID, floor])
  

  const styles = { display: "flex", position: "relative", height: "calc(100vh - 100px)", transition: "margin-left 1s ease"};

  
  return (
    <>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossOrigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossOrigin=""></script>
    <div className="main-container">
    <Sidebar collapse={collapse} setCollapse={setCollapse} />
        <div className="map-main-panel" style={{zIndex:"0"}}>
          <div id="mapWrap">
            <div id="mapContainer"></div>
          </div>
        </div>
  </div>
    </>
)  
}