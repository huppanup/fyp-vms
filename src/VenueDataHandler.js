import { storage } from './firebase';
import { ref, getDownloadURL, listAll } from "firebase/storage";
// NOTE: All functions here return a promise.

// Retrieves file URL from storage path
function getFileURL(path){
    const pathRef = ref(storage, path);
    return getDownloadURL(ref(storage, pathRef))
        .then((url) => { return url })
        .catch((e) => console.log(e));
}

// Requests download from storage path. Type can be either text or json.
function downloadData(path, type){
    // Data type should be either json or text, if neither it is set to text.
    if (type !== "json" && type !=="text"){
        type = "text";
    }

    return getFileURL(path)
        .then((url) => {
            return fetch(url);
        }).then((result) => {
            if (!result.ok) {
                throw new Error('Network response was not OK');
            }
            return type === "json" ? result.json() : result.text();
        }).catch((e) => console.log("Error : " + e));
}

// Retrieves venue info as JSON.
// STRUCTURE
// { venueName : string, venueID : venueID, floors : [string]}
function getVenueInfo(venueID){
    return downloadData(venueID + "/info.json", "json").then((data) => {
        const venueInfo = {
            "venueName" : data["site_name"],
            "venueID" : venueID,
            "floors" : data["floors"]
        }
        return venueInfo;
    });
}

// Retrieves floor info as JSON.
// STRUCTURE
// { venueID : string, floorNo : string, floorplan : string, settings : JSON{ scale : float, deviation : int, transformation : [float]}}
async function getFloorInfo(venueID, floorNo){
    const mapFile = await getFileURL(venueID + "/map/" + floorNo + "/map.jpg");
    const floorData = await downloadData(venueID + "/info.json", "json");
    return {
        "venueID" : venueID,
        "floorNo" : floorNo,
        "floorplan" : mapFile,
        "settings" : floorData["settings"][floorNo]
    };
}

// Retrieves constraint info from given storage reference as an array of JSON.
// [{ id : int, x : string, y : string }]
async function getConstraints(storRef){
    const res = await listAll(storRef);
    let id = 0;
    const constraintList = [];

    for (const item of res.items) {
        const data = await downloadData(item.fullPath, "text");
        const coordinates = data.split(" ");

        for (let i = 0; i < coordinates.length; i += 2) {
        const constraint = {
            id: id,
            x: coordinates[i],
            y: coordinates[i + 1],
        };
        id++;
        constraintList.push(constraint);
        }
    }
    return constraintList;
}

// Retrieves all constraint information for floorNo as JSON.
// { venueID : string, floorNo : string, in : [JSON], out : [JSON]}}
async function getAllConstraints(venueID, floorNo){
    const inConstraintsRef = ref(storage, venueID + "/Constraint/inConstraints/" + floorNo);
    const outConstraintsRef = ref(storage, venueID + "/Constraint/outConstraints/" + floorNo);
    const inConstraintsInfo = await getConstraints(inConstraintsRef);
    const outConstraintsInfo = await getConstraints(outConstraintsRef);

    return {
                venueID: venueID,
                floorNo: floorNo,
                in: inConstraintsInfo,
                out: outConstraintsInfo,
            };
}

// Retrieves magnetic series information for floorNo as JSON.
// { venueID : string, floorNo : string, magnetic : [JSON] } 
async function getMagData(venueID, floorNo) {
    const magneticData = await downloadData(venueID + "/MagData/MagSeriesData/" + floorNo + "/mag_series.txt", "text");
    const magSeriesData = magneticData.split("\n");
    const magneticList = [];
    magSeriesData.forEach(array => {
        const magSeriesArray = array.split(";");
        if (magSeriesArray[0].length === 0) return;
        const magData = magSeriesArray.reduce((acc, item) => {
            const subItems = item.split(" ");
            return acc.concat(subItems);
        }, []);
        const x = magData[0].split(",")[0];
        const y = magData[0].split(",")[1];
        const magnetic = {
            "x" : x,
            "y" : y,
            "mag_vex_sequences" : magData.slice(1),
        };
        magneticList.push(magnetic);
    });
    return {
        "venueID" : venueID,
        "floorNo" : floorNo,
        "magnetic" : magneticList
    };
}

export default function VenueData(id, f) {
    this.venueID = id;
    this.floor = f;
    this.getVenueInfo = () => getVenueInfo(this.venueID);
    this.getFloorInfo = () => getFloorInfo(this.venueID, this.floor);
    this.getAllConstraints = () => getAllConstraints(this.venueID, this.floor);
    this.getMagData = () => getMagData(this.venueID, this.floor);
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