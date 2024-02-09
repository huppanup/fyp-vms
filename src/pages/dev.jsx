import React from 'react';
import { useEffect, useState } from 'react';
import "../stylesheets/cloud.css";
import VenueData from '../VenueDataHandler';
import { addVenue, renameVenue } from "../DBHandler";

export default () => {
  const [curVenueID, setCurVenueID] = useState('HKUST_fusion');
  const [curFloor, setCurFloor] = useState('LSK1');

  const venueHandler = new VenueData(curVenueID, curFloor);

  const [venueInfo, setVenueInfo] = useState();
  
  return (
    <>
    <div className="main-container">
        <div className="cloud-main-panel">
        
        <div>
        <button onClick={() => setCurFloor("LSK3")}>HI CLICK ME TO CHANGE THE FLOOR</button>
        <button onClick={() => addVenue("New Venue!")}>Add Venue</button>
        <button onClick={() => renameVenue("-Nq1DwM8ce08f-LQHvA6","Renamed venue!")}>Rename Venue</button>
        <button onClick={() => venueHandler.getAllConstraints().then((data) => {setVenueInfo(data);})}>Get Constraint</button>
        <button onClick={() => venueHandler.getFloorInfo().then((data) => {setVenueInfo(data);})}>Get Floor Information</button>
        <button onClick={() => venueHandler.getVenueInfo().then((data) => {setVenueInfo(data);})}>Get Venue Information</button>
        </div>
        <div><a>{JSON.stringify(venueInfo)}</a></div>
        </div>
  </div>
    </>
)  
}