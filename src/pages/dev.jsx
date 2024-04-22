import React from 'react';
import { useEffect, useState } from 'react';
import "../stylesheets/cloud.css";
import VenueData from '../VenueDataHandler';
import { getLikedLocations, removeLikedLocations, updateLikedLocations} from '../DBHandler';
import { addVenue, renameVenue, getLikedLocationsFirestore } from "../DBHandler";
import { useAuth } from '../AuthContext';
import { useVenue } from '../LocationContext';
import Sidebar from '../components/Sidebar';

export default () => {
  const {venueID,
    floor,
    setSelectedVenue,
    setSelectedFloor,
    checkVenueExists,
    dataHandler
  } = useVenue();
  const [curVenueID, setCurVenueID] = useState('-NrisipFr0yx32oaNHQz');
  const [curFloor, setCurFloor] = useState('GF');
  const [testing, setTesting] = useState('');
  const {currentUser, deleteAccount,
    resetPassword,
    resetEmail,} = useAuth();

  const styles = { display: "flex", position: "relative", height: "calc(100vh - 100px)", transition: "margin-left 1s ease"};
  const venueHandler = new VenueData('-NrisipFr0yx32oaNHQz', 'GF');

  const [venueInfo, setVenueInfo] = useState();
  const [collapse, setCollapse] = useState(false);

  function getLikedLocationsNames(){
      const locations = getLikedLocations(currentUser.uid);
      const result = [];
      for (var key in locations){
        result.push({[key] : locations[key]["name"]})
      }
      return result
  }
  
  return (
  <div style={styles}>
    <Sidebar collapse={collapse} setCollapse={setCollapse}/>
    <div className={"bodyTemp " + (collapse ? "collapse" : "")} style={{zIndex: "0", position:"relative"}}>
        
        <button onClick={() => setCurFloor("LSK3")}>HI CLICK ME TO CHANGE THE FLOOR</button>
        <button onClick={() => addVenue("ABC")}>Add Venue</button>
        {/*<button onClick={() => renameVenue("-Nq1DwM8ce08f-LQHvA6","Renamed venue!")}>Rename Venue</button>*/}
        <button onClick={() => venueHandler.getAllConstraints().then((data) => {setVenueInfo(data);})}>Get Constraint</button>
        <button onClick={() => venueHandler.getFloorInfo().then((data) => {setVenueInfo(data);})}>Get Floor Information</button>
        <button onClick={() => venueHandler.getVenueInfo().then((data) => { setVenueInfo(data);})}>Get Venue Information</button>
        <button onClick={() => venueHandler.getMagData().then((data) => {setVenueInfo(data);})}>Get Magnetic Data Information</button>
        <button onClick={() => venueHandler.getWifiData('-NrisipFr0yx32oaNHQz', 'GF').then((data) => {setVenueInfo(data);})}>Get Wifi Data Information</button>
        <button onClick={() => setVenueInfo(currentUser.uid)}>Get User ID Token</button>
        <button onClick={() => setVenueInfo(getLikedLocationsNames())}>Get Liked Locations</button>
        <button onClick={() => setSelectedVenue("HKUST_fusion")}>Select venue</button>
        <button onClick={() => setSelectedFloor("GF")}>Select GF</button>
        <button onClick={() => setSelectedFloor("LG1")}>Select LG1</button>
        <button onClick={() => resetPassword("clover107!", "huppanup107!").then((r) => {if (r.success){ console.log(r.result)} else { console.log(r.error)}})}>Reset password to "hello"</button>
        <button onClick={() => resetEmail("huppanup107!", "huppanup@naver.com")}>Change email to huppanup@naver.com</button>
        <button onClick={() => deleteAccount()}>Delete and sign out account</button>
        <div>Firestore connnection testing</div>
        <button onClick={() => getLikedLocations(currentUser.uid)}>Get Liked Locations</button>
        <button onClick={() => updateLikedLocations(currentUser.uid, {"testID1" : {"name" : "Test Venue1", "dateAdded" : new Date().toISOString().split('T')[0]}})}>Add Liked Locations</button>
        <button onClick={() => removeLikedLocations(currentUser.uid, "testID1")}>Remove Liked Locations</button>





        
        <div><a>{JSON.stringify(venueInfo)}</a></div>
    </div>
  </div>
)  
}