import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, listAll } from "firebase/storage";
import {storage} from "../firebase"
import Dropdown from "../components/Dropdown"
import { getLikedLocations, checkVenueExists, getVenues } from "../DBHandler";
import { useAuth } from "../AuthContext";
import "../stylesheets/header.css"
import { update } from "firebase/database";
import { useVenue } from "../LocationContext";


export default () => {
    const {currentUser} = useAuth();
    const [venueList, setVenueList] = useState([]);
    const nav = useNavigate();
    const location = useLocation();

    const {venueID, setVenue} = useVenue();

    useEffect(() => {
        getLikedLocations(currentUser.uid).then((likedLocation) => {
          if (likedLocation != null) {
            const result = {};
            for (var key in likedLocation){
                result[key] = likedLocation[key]["name"];
            }
            setVenueList(result);
          } else {
            getVenues().then((venues) => {
              if (venues != null){
                const result = {};
                for (var key in venues){
                    result[key] = venues[key];
                }
                setVenueList(result);
              }
            })
          }
      });
        
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
              active={true}
            />
            </div>
      </div>
    );
};


