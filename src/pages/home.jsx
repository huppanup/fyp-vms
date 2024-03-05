import React, { useState, useEffect } from "react";
import { FaSearch, FaStar, FaPlus } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import "../stylesheets/home.css";
import Popup from "../components/popup"
import { addVenue, getLikedLocations, removeLikedLocations, updateLikedLocations } from "../DBHandler";
import { LargeButton } from "../components/LargeButton";
import { useAuth } from '../AuthContext';
import FuzzySearch from "react-fuzzy";

const inputWrapperStyle = {
  width: "50vw",
  border: "1px solid #ccc",
  borderRadius: "30px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.25)"
}

const inputStyle = {
  width: "50vw",
  border: "none",
  borderRadius: "30px",
}

export default () => {
  const database = getDatabase();
  const [likedLocations, setLikedLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const {currentUser} = useAuth();
  const [venues, setVenues] = useState([]);

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
            <FuzzySearch
              list={venues}
              keys={["author", "title"]}
              width={"50vw"}
              onSelect={(s) => {}}
              inputWrapperStyle={inputWrapperStyle}
              inputStyle={inputStyle}
              placeholder={"Search Venue..."}
              listWrapperStyle={{
                position: "absolute",
                zIndex: 1,
                width:"50vw"
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
