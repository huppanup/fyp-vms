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
async function getVenueInfo(venueID){
    console.log("Fetching venue info for " + venueID);
    const data = await downloadData(venueID + "/info.json", "json");
    let transformationData = await downloadData(venueID + "/map/geodata.csv", "text");
    transformationData = transformationData.trim().split(",\r\n").map(item => item.split(" "));
    if (!data || !transformationData) return;
    const venueInfo = {
        "venueName": data["site_name"],
        "venueID": venueID,
        "floors": data["floors"],
        "settings" : data["settings"],
        "transformation" : transformationData
    };
    return venueInfo;
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

// async function getAllConstraints(venueID, floorNo) {
//     const constraintData = await downloadData(venueID + "/map/" + floorNo + "/map.json", "json");
//     if (!constraintData) return;
//     const inConstraintsData = constraintData["shapes"].filter(shape => shape["label"].includes("inConstraint"));
//     const outConstraintsData = constraintData["shapes"].filter(shape => shape["label"].includes("outConstraint"));
//     const inConstraints = [];
//     const outConstraints = [];
//     let id = 0;
//     inConstraintsData.forEach(data => {
//         for (let i = 0; i < data["points"].length; i++) {
//             const constraint = {
//                 id: id,
//                 label: data["label"],
//                 x: data["points"][i][0],
//                 y: data["points"][i][1]
//             };
//             id++;
//             inConstraints.push(constraint);
//         }
//     });
//     id = 0;
//     outConstraintsData.forEach(data => {
//         for (let i = 0; i < data["points"].length; i++) {
//             const constraint = {
//                 id: id,
//                 label: data["label"],
//                 x: data["points"][i][0],
//                 y: data["points"][i][1]
//             };
//             id++;
//             outConstraints.push(constraint);
//         }
//     });
//     return {
//         venueID: venueID,
//         floorNo: floorNo,
//         in: inConstraints,
//         out: outConstraints,
//     };
// }

// Retrieves magnetic series information for floorNo as JSON.
// { venueID : string, floorNo : string, magnetic : [JSON] } 
async function getMagData(venueID, floorNo) {
    const magneticData = await downloadData(venueID + "/MagData/MagSeriesData/" + floorNo + "/mag_series.txt", "text");
    const magSeriesData = magneticData.split("\n");
    let magneticList = [];
    magSeriesData.forEach(array => {
        const magSeriesArray = array.split(";");
        if (magSeriesArray[0].length === 0) return;
        const magData = magSeriesArray.reduce((acc, item) => {
            const subItems = item.split(" ");
            return acc.concat(subItems);
        }, []);
        const x = magData[0].split(",")[0];
        const y = magData[0].split(",")[1];
        const data = magData.slice(1);
        let dataList = [];
        data.forEach(item => {
            const dataJSON = {
                "gravity_drifting" : item.split(",")[0],
                "horizontal_vertex" : item.split(",")[1],
                "vertical_vertex" : item.split(",")[2]
            }
            dataList.push(dataJSON);
        });
        
        const magnetic = {
            "x" : x,
            "y" : y,
            "mag_vex_sequences" : dataList,
        };
        magneticList.push(magnetic);
    });
    return {
        "venueID" : venueID,
        "floorNo" : floorNo,
        "magnetic" : magneticList
    };
}

// Retrieves WIFI information for floorNo as JSON.
// { venueID : string, floorNo : string, wifi : [JSON] } 
async function getWifiData(venueID, floorNo) {
    const wifiData = await downloadData(venueID + "/WifiData/FingerprintData/" + floorNo + "/fingerprint.txt", "text");
    const wifiSeriesData = wifiData.split("\n");
    let WifiList = [];
    wifiSeriesData.forEach(array => {
        const wifiSeriesArray = array.split(" ");
        const x = wifiSeriesArray[0].split(",")[0];
        const y = wifiSeriesArray[0].split(",")[1];
        const data = wifiSeriesArray.slice(1);
        
        let dataList = [];
        data.forEach(item => {
            const dataJSON = {
                "SSID" : item.split(",")[0],
                "threshold" : item.split(",")[1].split(".")[0],
                "enabled" : item.split(",")[3]
            }
            dataList.push(dataJSON);
        });
        const wifi = {
            "x" : x,
            "y" : y,
            "data" : dataList
        }
        WifiList.push(wifi);
    });
    return {
        "venueID" : venueID,
        "floorNo" : floorNo,
        "wifi" : WifiList
    };
}

export default function VenueData() {
    this.getVenueInfo = (id) => getVenueInfo(id);
    this.getFloorInfo = (id, floor) => getFloorInfo(id, floor);
    this.getAllConstraints = (id, floor) => getAllConstraints(id, floor);
    this.getMagData = (id, floor) => getMagData(id, floor);
    this.getWifiData = (id, floor) => getWifiData(id, floor);
    this.editConstraint = (type, id, x, y) => editConstraint(this.venueID, this.floor, type, id, x, y);
}

async function editConstraint(locationID, floorNo, type, id, x, y){
    if (type === "in") {
        const inConstraintsRef = ref(storage, locationID + "/Constraint/inConstraints/" + floorNo);
        const res = await listAll(inConstraintsRef);
        let idLeft = id;
        for (const item of res.items) {
            const data = await downloadData(item.fullPath, "text");
            const coordinates = data.split(" ");
            if (coordinates.length / 2 <= idLeft) {
                idLeft = idLeft - coordinates.length / 2;
                continue;
            }
            console.log(coordinates);
            if (coordinates[2 * idLeft] === x && coordinates[2 * idLeft + 1] === y) {
                return {"found" : true};
            } else {
                return {"not found" : coordinates[2 * idLeft]};
            }
        }
    } else {
        const outConstraintsRef = ref(storage, locationID + "/Constraint/outConstraints/" + floorNo);
        const res = await listAll(outConstraintsRef);
        let idLeft = id;
        for (const item of res.items) {
            const data = await downloadData(item.fullPath, "text");
            const coordinates = data.split(" ");
            if (coordinates.length / 2 <= idLeft) {
                idLeft = idLeft - coordinates.length / 2;
                continue;
            }
            console.log(coordinates);
            if (coordinates[2 * idLeft] === x && coordinates[2 * idLeft + 1] === y) {
                return {"found" : true};
            } else {
                return {"not found" : coordinates[2 * idLeft]};
            }
        }
    }
}

function editAlignment(locationID, floorNo, latitude, longitude, angle, scale){
    const result = {"success":true}
    return result
}

function editFloorplan(locationID, floorNo, name, number, altitude, image){
    const result = {"success":true}
    return result
}