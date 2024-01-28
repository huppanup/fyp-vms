import React, { useState, useEffect } from "react";
import { FaSearch, FaStar } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import "../stylesheets/home.css";
import Navbar from "../components/navbar";

export default () => {
  const database = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;
  var userId = "123456";
  if (user) {
    userId = user.uid;
  }
  console.log(userId);
  const [likedLocations, setLikedLocations] = useState([]);

  useEffect(() => {
    const likedLocationsRef = ref(database, "users/" + userId + "/likedLocations");
    onValue(likedLocationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const likedLocationsList = Object.values(data);
        setLikedLocations(likedLocationsList);
      }
    });
  }, [userId]);

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
  
  return (
    <>
      <div className="home-container">
        <div className="nav">
          <Navbar />
        </div>
        <div className="main-panel">
          <div class="search-bar">
            <input
              type="text"
              class="search-input"
              placeholder="Search venue..."
            />
            <button class="search-button">
              <FaSearch />
            </button>
          </div>
          <h1> My Favorites </h1>
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
      </div>
    </>
  );
};