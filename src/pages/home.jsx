import React, { useState, useEffect } from "react";
import { FaSearch, FaStar, FaPlus } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import "../stylesheets/home.css";
import Popup from "../components/popup"
import { addVenue } from "../DBHandler";
import { LargeButton } from "../components/LargeButton";


export default () => {
  const database = getDatabase();
  const auth = getAuth();
  const [likedLocations, setLikedLocations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await auth.currentUser;
      if (user) {
        setUserId(user.uid);
      }
    };
    fetchUser();
  }, [auth]);

  useEffect(() => {
    if (userId) {
      const likedLocationsRef = ref(database, `users/${userId}/likedLocations`);
      onValue(likedLocationsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const likedLocationsList = Object.values(data);
          setLikedLocations(likedLocationsList);
        }
      });
    }
  }, [userId, database]);

  const toggleLike = (location) => {
    const isLiked = likedLocations.some((likedLocation) => likedLocation.name === location.name);
    
    if (isLiked) {
      // Remove the location from likedLocations
      //const updatedLikedLocations = likedLocations.filter((likedLocation) => likedLocation.name !== location.name);
      removeLikedLocations(location);
    } else {
      // Add the location to likedLocations
      const updatedLikedLocations = [...likedLocations, location];
      updateLikedLocations(updatedLikedLocations);
    }
  }

  const removeLikedLocations = (location) => {
    const likedLocationRef = ref(database, `users/${userId}/likedLocations/${location.name}`);
    remove(likedLocationRef)
    .then(() => {
      const updatedLikedLocations = likedLocations.filter((likedLocation) => likedLocation.name !== location.name);
      setLikedLocations(updatedLikedLocations);
      console.log("Location removed successfully");
    })
    .catch((error) => {
      console.error("Error removing location:", error);
    });
  }

  const updateLikedLocations = (updatedLikedLocations) => {
    console.log(updatedLikedLocations);
    const likedLocationRef = ref(database, `users/${userId}/likedLocations`);
    const updatedLikedLocationsObject = updatedLikedLocations.reduce((acc, location) => {
      acc[location.locationId] = location;
      return acc;
    }, {});
  
    update(likedLocationRef, updatedLikedLocationsObject)
      .then(() => {
        console.log("Data updated successfully");
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };
  
  const message = <div><div>Venue Name</div><input type="text" name="text"></input></div>;
  return (
    <>
      <div className="main-container">
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
