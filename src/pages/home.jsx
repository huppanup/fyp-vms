import React, { useState, useEffect } from "react";
import { FaSearch, FaStar, FaPlus } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import "../stylesheets/home.css";
import Popup from "../components/popup"
import { addVenue, getLikedLocations, removeLikedLocations, updateLikedLocations } from "../DBHandler";
import { LargeButton } from "../components/LargeButton";
import { useAuth } from '../AuthContext';


export default () => {
  const database = getDatabase();
  const [likedLocations, setLikedLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const {currentUser} = useAuth();

  useEffect(() => {
    if (currentUser.uid) {
      const likedLocations = getLikedLocations(currentUser.uid);
      if (likedLocations) {
        const likedLocationsList = Object.values(likedLocations);
        setLikedLocations(likedLocationsList);
      }
    }
  }, [currentUser]);

  const toggleLike = (location) => {
    const isLiked = likedLocations.some((likedLocation) => likedLocation.name === location.name);
    if (isLiked) {
      // Remove the location from likedLocations
      //const updatedLikedLocations = likedLocations.filter((likedLocation) => likedLocation.name !== location.name);
      removeLikedLocations(currentUser.uid, location).then(() => {
        const updatedLikedLocations = likedLocations.filter((likedLocation) => likedLocation.name !== location.name);
        setLikedLocations(updatedLikedLocations);
      })
      .catch((error) => {
        console.error("Error removing location:", error);
      });
    } else {
      // Add the location to likedLocations
      const updatedLikedLocations = [...likedLocations, location];
      updateLikedLocations(currentUser.uid, updatedLikedLocations).then(() => {
        setLikedLocations(updatedLikedLocations);
      })
      .catch((error) => {
        console.error("Error updating location:", error);
      });
    }
  }

  
  const message = <div><div>Venue Name</div><input type="text" name="text"></input></div>;
  return (
    <>
      <div className="home-container">
      <Popup modalOpen={modalOpen} setModalOpen={setModalOpen} message={message} navigateTo={false}/>
        <div className="main-panel">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search Venue..."
            />
            <button className="search-button">
              <FaSearch size={18} />
            </button>
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
            {likedLocations.map((location) => (
                <tr key={location.name}>
                  <td className="star-cell">
                    <button
                      onClick={() => toggleLike(location)}
                      className={`favorite-button ${likedLocations.some(
                        (likedLocation) => likedLocation.name === location.name
                      ) && "active"}`}
                    >
                      {likedLocations.some((likedLocation) => likedLocation.name === location.name)
                        ? <FaStar className="star-icon active" size={20} />
                        : <FaStar className="star-icon" size={20} />}
                    </button>
                  </td>
                  <td>{location.name}</td>
                  <td>{location.dateAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        <div style={{position: "fixed", right:"250px", bottom:"100px"}}><LargeButton onClick={() => setModalOpen(true)} icon={<FaPlus size={15} />} value={"Add Venue"} /></div>
      </div>
    </>
  );
};
