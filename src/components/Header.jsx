import React from "react";
import { FaStar } from "react-icons/fa";
import {useSearchParams} from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, listAll, getDownloadURL, getMetadata, uploadBytes } from "firebase/storage";
import {storage} from "../firebase"
import { getLikedLocations } from "../DBHandler";
import { useAuth } from "../AuthContext";
import "react-dropdown/style.css";
import "../stylesheets/header.css"
import Dropdown from "react-dropdown";


export default () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const {currentUser} = useAuth();
    const [venues, setVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState("");

    useEffect(() => {
        const locations = getLikedLocations(currentUser.uid);
        const result = [];
        for (var key in locations){
            result.push(locations[key]["name"]);
        }
        if (!selectedVenue){
            setSelectedVenue(result[0]);
            
        }
        setSearchParams({["id"]: Object.keys(locations)[0]});
        setVenues(result);
      }, [selectedVenue]);

    return (
        <div className="header">
            <div className="header-left">
            <FaStar className="star-icon active" size={40} />
            <Dropdown className="venue-name" options={venues} value={selectedVenue}
                onChange={(option) => setSelectedVenue(option.value)}
                placeholder=""
                controlClassName="myControl"
                arrowClassName="myArrow"
            />
            </div>
      </div>
    );
};


