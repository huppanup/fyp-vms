import { storage } from './firebase';
import {ref,getDownloadURL} from "firebase/storage";

// Retrieves and callbacks file URL from storage path
function getFileURL(path, callback){
    const pathRef = ref(storage, path);
    getDownloadURL(ref(storage, pathRef))
        .then((url) => callback(url))
        .catch((e) => console.log(e));
}

// Requests download from storage path and callbacks the result. Type can be either text or json.
function downloadData(path, type, callback){
    // Data type should be either json or text, if neither it is set to text.
    if (type !== "json" && type !=="text"){
        type = "text";
    }
    // Retrieves raw text
    getFileURL(path, (url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = type;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                callback(xhr.response);
            }
          };
        xhr.open('GET', url);
        xhr.send();
    });
}

// Retrieves venue info as JSON.
// STRUCTURE
// { venueName : string, venueID : venueID, floors : [string]}
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

// Retrieves floor info as JSON.
// STRUCTURE
// { venueID : string, floorNo : string, floorplan : string, settings : JSON{ scale : float, deviation : int, transformation : [float]}}
function getFloorInfo(venueID, floorNo, callback){
    getFileURL(venueID + "/map/" + floorNo + "/map.jpg", (url) => {
        downloadData(venueID + "/info.json", "json", (data) => {
            const floorinfo = {
                "venueID" : venueID,
                "floorNo" : floorNo,
                "floorplan" : url,
                "settings" : data["settings"][floorNo]
            }
            callback(floorinfo);
        });
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

export default function VenueData(id, f) {
    this.venueID = id;
    this.floor = f;
    this.getVenueInfo = (callback) => getVenueInfo(this.venueID, (data) => {callback(data)});
    this.getFloorInfo = (callback) => getFloorInfo(this.venueID, this.floor, (data) => {callback(data)});
    this.getConstraint = (floorNo, callback) => getConstraint(this.venueID,this.floor,callback);
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