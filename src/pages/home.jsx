import React, { useState, useEffect } from "react";
import { FaSearch, FaStar, FaPlus } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import "../stylesheets/home.css";
import Popup from "../components/popup"
import { addVenue, getLikedLocations, removeLikedLocations, updateLikedLocations, createLikedLocations } from "../DBHandler";
import { LargeButton } from "../components/LargeButton";
import { useAuth } from '../AuthContext';
import FuzzySearch from "react-fuzzy";
import {useVenue} from '../LocationContext';
import { useNavigate } from "react-router-dom";

const inputWrapperStyle = {
  width: "50vw",
  border: "1px solid #ccc",
  borderRadius: "30px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  paddingLeft: "10px"
}

const inputStyle = {
  width: "50vw",
  border: "none",
  borderRadius: "30px",
}

const resultStyle = {
  display: "flex",
  width: "100%",
  borderBottom: "solid 1px #5a5a5a3e",
  boxSizing: "border-box",
  padding: "10px",
  backgroundColor: "white"
}

const listWrapperStyle = {
  position: "absolute",
  zIndex: 1,
  width:"50vw",
  maxHeight: "400px",
  overflowY: "scroll",
  border: "solid 0.5px #5a5a5a3e",
  borderRadius: "15px",
  boxSizing: "border-box",
  padding: "0",
  backgroundColor: "white",
}

export default () => {
  const database = getDatabase();
  const { setVenue, loading } = useVenue();
  const [likedLocations, setLikedLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const {currentUser} = useAuth();
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser.uid) {
      const venuesRef = ref(database, 'venues');
      onValue(venuesRef, (snapshot) => {
        const data = snapshot.val();
        const fetchedVenueNames = [];
        for (const key in data) {
          fetchedVenueNames.push({ author : key, title : data[key]});
        }
        setVenues(fetchedVenueNames);
      });
      getLikedLocations(currentUser.uid).then((liked) => {
        setLikedLocations(liked);
      });
    }
  }, [currentUser]);

  const toggleLike = (id, location) => {
    const isLiked = likedLocations && Object.keys(likedLocations).some((locationId) => locationId === id);
    if (isLiked) {
      removeLikedLocations(currentUser.uid, id);
      getLikedLocations(currentUser.uid).then((liked) => {
        setLikedLocations(liked);
      });
    } else {
      if (likedLocations) {
        let updatedLikedLocations = likedLocations;
        updatedLikedLocations[id] = location;
        updateLikedLocations(currentUser.uid, updatedLikedLocations);
      } else {
        let updatedLikedLocations = [];
        updatedLikedLocations[id] = location;
        createLikedLocations(currentUser.uid, updatedLikedLocations);
      }
      getLikedLocations(currentUser.uid).then((liked) => {
        setLikedLocations(liked);
      });
    }
  }

  
  const message = <div><div>Venue Name</div><input type="text" name="text"></input></div>;
  return (
    <>
      <div className="home-container" style={{userSelect: "none"}}>
      <Popup modalOpen={modalOpen} setModalOpen={setModalOpen} message={message} navigateTo={false}/>
        <div className="main-panel">
          <div className="search-bar">
            <FuzzySearch
              list={venues}
              keys={["author", "title"]}
              width={"50vw"}
              onSelect={(s) => {}}
              inputWrapperStyle={inputWrapperStyle}
              inputStyle={inputStyle}
              placeholder={"Search Venue..."}
              listWrapperStyle={listWrapperStyle}
              resultsTemplate={(props, state) => {
                return state?.results?.map((val, i) => {
                  return (
                    <div key={i} style={resultStyle}>
                      {likedLocations && Object.keys(likedLocations).some((locationId) => locationId === val.author) ? 
                      <FaStar className="star-icon active" size={20} style={{marginLeft: "5px", marginRight: "15px"}} onClick={() => toggleLike(val.author, val.title)}/> 
                      : <FaStar className="star-icon" size={20} style={{marginLeft: "5px", marginRight: "15px"}} onClick={() => toggleLike(val.author, {"name" : val.title, "dateAdded" : new Date().toISOString().split('T')[0]})}/>}
                      <div onClick={() => {setVenue(val.author); navigate('/map');}}>
                        {val.title}
                      </div>
                    </div>
                  );
                });
              }}
              verbose={false}
            />
          </div>
          <h1 className="favorites"> My Favorites </h1>
          <table className="table">
            <thead>
              <tr>
                <th className="star-head"></th>
                <th>Name</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
            {likedLocations && Object.entries(likedLocations).map(([id, location]) => (
                <tr key={location.name}>
                  <td className="star-cell">
                    <button
                      onClick={() => toggleLike(id, location)}
                      className={`favorite-button active`}
                    >
                    <FaStar className="star-icon active" size={20} />
                    </button>
                  </td>
                  <td onClick={() => {setVenue(id); navigate('/map');}}>{location.name}</td>
                  <td>{location.dateAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        <div style={{position: "fixed", right:"250px", bottom:"100px"}}><LargeButton onClick={() => navigate('add')} icon={<FaPlus size={15} />} value={"Add Venue"} /></div>
      </div>
    </>
  );
};
