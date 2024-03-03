import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import {storage} from "../firebase"

import { getLikedLocations, checkVenueExists } from "../DBHandler";
import { useAuth } from "../AuthContext";
import "react-dropdown/style.css";
import "../stylesheets/header.css"
import Dropdown from "react-dropdown";
import { update } from "firebase/database";


export default () => {
    const {currentUser} = useAuth();
    const [venues, setVenues] = useState([]);
    const [likedLocations, setLikedLocations] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState("");
    const nav = useNavigate();
    const location = useLocation();


    const updatePath = (venue) => {
        var curPath = location.pathname.split('/');
        if (curPath.length > 2) {curPath = curPath.slice(1, -1);}
        const newPath = `${curPath.join('/')}/${venue}`;
        nav(newPath);
    }

    const handleLocationSelect = (venue) => {
        setSelectedVenue(venue);
        updatePath(venue.value);
    }

    useEffect(() => {
        const likedLocation = getLikedLocations(currentUser.uid);
        if (likedLocation != null) {
          const result = [];
          for (var key in likedLocation){
              result.push({ value : key, label : likedLocation[key]["name"]});
          }
          setVenues(result);
          if (selectedVenue === "" || selectedVenue === null){
              handleLocationSelect(result[0]);    
          }
        } else {
          const storageRef = ref(storage);
          listAll(storageRef)
            .then((res) => {
              const fetchedVenueNames = [];
              res.prefixes.map((prefix) => {
                const formattedName = prefix.name.replace(/_/g, " ");
                fetchedVenueNames.push({ value : prefix.name, label : formattedName });
              });
              setVenues(fetchedVenueNames);
              if (selectedVenue === "" || selectedVenue === null){
                handleLocationSelect(fetchedVenueNames[0]);
              }
            })
            .catch((error) => {
              console.error("Error fetching venue names:", error);
            });
        }
      }, []);

    useEffect(() => {
        updatePath(selectedVenue.value);
      }, [location.pathname]);

    return (
        <div className="header">
            <div className="header-left">
            <FaStar className="star-icon active" size={40} />
            <Dropdown className="venue-name" options={venues} value={selectedVenue}
                onChange={(option) => handleLocationSelect(option)}
                placeholder=""
                controlClassName="myControl"
                arrowClassName="myArrow"
            />
            </div>
      </div>
    );
};


