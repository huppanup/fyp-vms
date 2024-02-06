import React from 'react';
import { useEffect, useState } from 'react';
import "../stylesheets/cloud.css";
import VenueData from '../VenueDataHandler';

export default () => {
  const currentVenue = new VenueData('HKUST_fusion');
  const [venueInfo, setVenueInfo] = useState();
  useEffect(() => {
    currentVenue.getVenueInfo((data) => {
      setVenueInfo(data);
    });
  },[]);
  
  
  
  return (
    <>
    <div className="main-container">
        <div className="cloud-main-panel">
        <div><a>{JSON.stringify(venueInfo)}</a></div>
        <iframe width="100%" height="100%" src="https://www.openstreetmap.org/export/embed.html?bbox=127.08180248737337%2C37.319532987776675%2C127.08387047052386%2C37.321023990244015&amp;layer=mapnik" style={ {border : "1px solid black"}}></iframe>
        </div>
  </div>
    </>
)  
}