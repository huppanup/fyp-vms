import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import {storage} from "../firebase"
import Dropdown from "../components/Dropdown"
import { getLikedLocations, checkVenueExists } from "../DBHandler";
import { useAuth } from "../AuthContext";
import "../stylesheets/header.css"
import { update } from "firebase/database";
import { useVenue } from "../LocationContext";


export default () => {
    const {currentUser} = useAuth();
    const [venueList, setVenueList] = useState([]);
    const nav = useNavigate();
    const location = useLocation();

    const {venueID, setVenue, venueInfo} = useVenue();


    const updatePath = (venue) => {
        var curPath = location.pathname.split('/');
        if (curPath.length > 2) {curPath = curPath.slice(1, -1);}
        const newPath = `${curPath.join('/')}/${venue}`;
        nav(newPath);
    }

    useEffect(() => {
        getLikedLocations(currentUser.uid).then((likedLocation) => {
          if (likedLocation != null) {
            const result = {};
            for (var key in likedLocation){
                result[key] = likedLocation[key]["name"];
            }
            setVenueList(result);
          } else {
            const storageRef = ref(storage);
            listAll(storageRef)
              .then((res) => {
                const fetchedVenueNames = [];
                res.prefixes.map((prefix) => {
                  fetchedVenueNames.push({ key : prefix.name, name : prefix.name });
                });
                setVenueList(fetchedVenueNames);
              })
              .catch((error) => {
                console.error("Error fetching venue names:", error);
              });
          }
      });
        
      }, []);

    useEffect(() => {
        updatePath(venueID);
      }, [venueID]);

    return (
        <div className="header">
            <div className="header-left">
            <FaStar className="star-icon active" size={40} />
            <Dropdown 
              id="venueList"
              options={venueList}
              selected={(v) => setVenue(v)}
              placeholder={"Select a venue"}
            />
            </div>
      </div>
    );
};


