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
  // useEffect(() => {
  //   venueHandler.getVenueInfo((data) => {
  //     console.log(data);
  //   });
  //   venueHandler.getFloorInfo((data) => {
  //     console.log(data);
  //   });
  // },[curFloor]);
  
  return (
    <>
    <div className="main-container">
        <div className="cloud-main-panel">
        
        <div>
        <button onClick={() => setCurFloor("LSK3")}>HI CLICK ME TO CHANGE THE FLOOR</button>
        <button onClick={() => addVenue("New Venue!")}>Add Venue</button>
        <button onClick={() => renameVenue("-Nq1DwM8ce08f-LQHvA6","Renamed venue!")}>Rename Venue</button>
        <button onClick={() => venueHandler.getConstraint((data) => {setVenueInfo(data);})}>Get Constraint</button>
        <button onClick={() => venueHandler.getFloorInfo((data) => {setVenueInfo(data);})}>Get Floor Information</button>
        <button onClick={() => venueHandler.getVenueInfo((data) => {setVenueInfo(data);})}>Get Venue Information</button>
        </div>
        <div><a>{JSON.stringify(venueInfo)}</a></div>
        </div>
  </div>
    </>
)  
}