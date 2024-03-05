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
        const newPath = `${curPath.join('/')}/${venueID}`;
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
                const result = {};
                res.prefixes.map((prefix) => {
                  result[prefix.name] = prefix.name;
                });
                setVenueList(result);
              })
              .catch((error) => {
                console.error("Error fetching venue names:", error);
              });
          }
      });
        
      }, []);

    useEffect(() => {
        updatePath(venueID);
      }, []);

    return (
        <div className="header">
            <div className="header-left">
            <FaStar className="star-icon active" size={30} />
            <Dropdown 
              id="venueList"
              options={venueList}
              onSelected={(v) => setVenue(v)}
              placeholder={"Select a venue"}
              style={{fontSize:"30px"}}
              curSelected={venueID}
            />
            </div>
      </div>
    );
};


