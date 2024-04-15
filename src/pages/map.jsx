import React from 'react';
import { useEffect, useState } from 'react';
import { ReactSVG } from "react-svg";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar"
import 'leaflet/dist/leaflet.css'
import '../stylesheets/map.css'
import VenueData from '../VenueDataHandler';
import { useVenue } from '../LocationContext';
import { calculateFloorPlanImage, initializeMap, loadFloorPlanImage, displayHeatmap, removeHeatMap } from '../leaflet';
import { getAlignment, setAlignmentBounds } from "../DBHandler";
import { set } from 'firebase/database';
import { LargeButton } from '../components/LargeButton';
import * as icons from "react-icons/fa6";


export default () => {

  const { venueID, floor, setVenue, setSelectedFloor, venueInfo, dataHandler } = useVenue();
  
  const [loadingMap, setLoadingMap] = React.useState(false);
  const [collapse, setCollapse] = React.useState(false);
  const [floorInfo, setFloorInfo] = React.useState();
  const [map, setMap] = React.useState(null);
  const [imageOverlay, setImageOverlay] = React.useState(null);
  const [imageBounds, setImageBounds] = React.useState({
      bottomLeft: null,
      upperRight: null,
      upperLeft: null,
      transformation: null,
      height: null,
      width: null
  });
  const [heatmapOn, setHeatMapOn] = React.useState(false);

  const location = useLocation();

  const imageStyle = {
    transform: 'rotate(90deg)'
  };

  useEffect(() => {
    let map = initializeMap();
    setMap(map);
    if (floor) {
      setLoadingMap(true);
      dataHandler.getFloorInfo(venueID, floor).then(data => {
        setFloorInfo(data);
        getAlignment(venueID, floor).then((result) => {
          if (result == null) {
            let {imageOverlay, bottomLeft, upperRight, upperLeft} = calculateFloorPlanImage(map, data["floorplan"], data["settings"]["transformation"], data["imageHeight"], data["imageWidth"]);
            setImageOverlay(imageOverlay);
            setAlignmentBounds(venueID, floor, bottomLeft, upperRight, upperLeft, data["settings"]["transformation"]);
            setImageBounds({bottomLeft: bottomLeft, upperRight: upperRight, upperLeft: upperLeft, transformation: data["settings"]["transformation"], height: data["imageHeight"], width: data["imageWidth"]});    
            setHeatMapOn(false);
            setLoadingMap(false);
          } else {
            let imageOverlay = loadFloorPlanImage(map, data["floorplan"], result["bottomLeft"], result["upperRight"], result["upperLeft"]);
            setImageOverlay(imageOverlay);
            setImageBounds({bottomLeft: result["bottomLeft"], upperRight: result["upperRight"], upperLeft: result["upperLeft"], transformation: result["transformation"], height: data["imageHeight"], width: data["imageWidth"]});
            setHeatMapOn(false);
            setLoadingMap(false);
          }
        });
      });
    }
  }, [venueID, floor]);

  const updateImageBounds = (newBounds) => {
    setImageBounds(newBounds);
  };

  const handleWifiHeatmap = () => {
    if (!heatmapOn) {
      dataHandler.getWifiData(venueID, floor).then(data => {
        displayHeatmap(map, data["wifi"], imageBounds.transformation);
      });
      setHeatMapOn(true);
    } else {
      removeHeatMap(map);
      setHeatMapOn(false);
    }
  }


  const styles = { display: "flex", position: "relative", height: "calc(100vh - 100px)", transition: "margin-left 1s ease"};

  
  return (
    <>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossOrigin=""/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossOrigin=""></script>
    <div className="main-container">
      {!loadingMap && <Sidebar 
        collapse={collapse} 
        setCollapse={setCollapse} 
        map={map}
        imageOverlay={imageOverlay}
        imageBounds={imageBounds}
        onUpdateImageBounds={updateImageBounds}
      />}
        <div className="map-main-panel" style={{zIndex:"0"}}>
          <div id="mapWrap">
            <div id="mapContainer"></div>
          </div>
        </div>
        {(!loadingMap && floor) &&
          <button className="button-heatmap" onClick={handleWifiHeatmap} style={{position:'absolute', right: '10px', top:'190px', width:'50px', height: '50px', borderRadius:'100%', backgroundColor: heatmapOn ? "gold" : "#FFFFFF", border: "none", boxShadow: "1px 1px gray", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <icons.FaWifi size={30} style={{margin: "auto"}}/>
          </button>
        } 
  </div>
    </>
)  
}