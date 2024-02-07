import React from 'react';
import { useEffect, useState } from 'react';
import "../stylesheets/cloud.css";
import VenueData from '../VenueDataHandler';

export default () => {
  const [curVenue, setCurVenue] = useState('HKUST_fusion');
  const [curFloor, setCurFloor] = useState('LSK1');

  const venueHandler = new VenueData(curVenue, curFloor);

  const [venueInfo, setVenueInfo] = useState();
  useEffect(() => {
    venueHandler.getVenueInfo((data) => {
      console.log(data);
    });
    venueHandler.getFloorInfo((data) => {
      console.log(data);
    });
    venueHandler.getConstraint((data) => {
      console.log(data);
    }); 
  },[curFloor]);
  
  
  
  return (
    <>
    <div className="main-container">
        <div className="cloud-main-panel">
        <div><a>{JSON.stringify(venueInfo)}</a></div>
        <button onClick={() => setCurFloor("LSK3")}>HI CLICK ME TO CHANGE THE FLOOR</button>
        <iframe width="100%" height="100%" src="https://www.openstreetmap.org/export/embed.html?bbox=127.08180248737337%2C37.319532987776675%2C127.08387047052386%2C37.321023990244015&amp;layer=mapnik" style={ {border : "1px solid black"}}></iframe>
        </div>
  </div>
    </>
)  
}