import React from 'react'
import { useEffect, useState } from 'react';
import { storage } from './firebase';
import {ref,getDownloadURL} from "firebase/storage";

function downloadData(path, type, callback){
    // Data type should be either json or text, if neither it is set to text.
    if (type !== "json" && type !=="text"){
        type = "text";
    }
    // Retrieves raw text
    const pathRef = ref(storage, path);
    getDownloadURL(ref(storage, pathRef))
    .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = type;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                callback(xhr.response);
            }
          };
        xhr.open('GET', url);
        xhr.send();
    }).catch((error) => {
    console.log("Error while downloading. "+ error);
    });
}

// Any reformatting of the texts should be handled in these wrapper functions, inside the callback.
function getVenueInfo(venueID, callback){
    downloadData(venueID + "/info.json", "json", (data) => {
        const venueInfo = {
            "venueName" : data["site_name"],
            "venueID" : venueID,
            "floors" : data["floors"]
        }
        callback(venueInfo);
    });
}

function getConstraint(venueID, floorNo, callback){ 
    
    // Returned JSON structure should be:
    /*
    { value:
        { 
            locationID: string,
            floorNo: int,
            in: [
                { 
                    id : int (index of constraint),
                    x : string (x coordinate), 
                    y : string (y coordinate)
                }, 
                { 
                    id : int,
                    x : string, 
                    y : string
                }, 
                ... ],
            out : [array of out-constraints]
        }
    }
    */
    downloadData(venueID + "/Constraint/inConstraints/" + floorNo, "json", (data) => {
        const venueInfo = {
            "venueName" : data["site_name"],
            "venueID" : venueID,
            "floors" : data["floors"]
        }
        callback(venueInfo);
    });
    }

export default function VenueData(id) {
    this.venueID = id;
    this.getVenueInfo = (callback) => getVenueInfo(this.venueID, (data) => {callback(data)});
    this.getConstraint = (floorNo, callback) => getConstraint(this.venueID,floorNo,callback);
}


function getAlignment(locationID, floorNo){
// Returned JSON structure should be:
/*
{ value:
    { 
        locationID : string,
        floorNo : int,
        latitude : string,
        longitude : string,
        angle : string,
        scale : string
    },
    success : boolean
}
*/
    const result = {"success":true}
    return result
}

function getFloorplan(locationID, floorNo){
// Returned JSON structure should be:
/*
{ value:
    { 
        locationID : string,
        floorNo : int,
        floorName : string,
        altitude : float?,
        filepath : string (floorplan image file)
    },
    success : boolean
}
*/
    const result = {"success":true}
    return result
}

function editConstraint(locationID, floorNo, type, id, x, y){
    const result = {"success":true}
    return result
}

function editAlignment(locationID, floorNo, latitude, longitude, angle, scale){
    const result = {"success":true}
    return result
}

function editFloorplan(locationID, floorNo, name, number, altitude, image){
    const result = {"success":true}
    return result
}