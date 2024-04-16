import React, { useState, useEffect } from "react";
import '../stylesheets/addvenue.css'
import { addVenue } from "../DBHandler";
import { storage } from "../firebase";
import {ref, uploadBytes, listAll, deleteObject} from "firebase/storage"
import JSZip from "jszip";
import { upload } from "@testing-library/user-event/dist/upload";

function parseInfoJSON(infoJSON, setCanSubmit){
  if (infoJSON && 'site_name' in infoJSON && 'floors' in infoJSON) setCanSubmit(true); else setCanSubmit(false);
  const venueInfo = (
    <div className="add-body">
      <div className="input-heading">Venue Name</div>
      <div style={{fontSize: '14px'}} id='site_name' value={infoJSON['site_name']}>{infoJSON['site_name'] ? infoJSON['site_name'] : <div style={{color:"red"}}>Missing Site Name!</div>}</div>
      <div className="input-heading">Floors</div>
      <div style={{fontSize: '14px'}}>{infoJSON['floors'] ? infoJSON['floors'].join(', ') : <div style={{color:"red"}}>Missing Floor Info!</div>}</div>
  </div>
  );
  return venueInfo;
}

function processJSON(file){
  try {
    return JSON.parse(file);
  } catch (error) {
    console.error('Error parsing JSON file:', error);
  }
}

function getDirName(zip){
  let folderName = null;
  zip.forEach((relativePath, file) => {
    if (file.dir && !folderName) {
      const segments = relativePath.split('/');
      console.log(segments)
      if (segments.length == 2) folderName = segments[0];
    }
  });
  return folderName;
}

function getContentType(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  switch (extension) {
    case 'txt':
      return 'text/plain';
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'json':
        return 'application/json';
    default:
      return 'application/octet-stream';
  }
}

function handleSubmit(e, canSubmit, name){
  e.preventDefault();
  if (!canSubmit) return alert("Please check your files.");
  //1. Add venue to database
  const venueID = addVenue(name);
  // 2. Add files to storage
  // 2.1. Collect files to upload
  const formData = new FormData(e.target);
  const files = {};

  for (let pair of formData.entries()) {
    const [name, value] = pair;
    if (value instanceof File && value.size > 0) {
      files[name] = value
    }
  }
  // 2.2. Upload Files
  try{
    for (let key in files){
      const storageRef = ref(storage, venueID);
      if (files[key].type == 'application/zip'){
        JSZip.loadAsync(files[key]).then(zip => { 
          const highestDir = getDirName(zip);
          zip.folder(highestDir).name = key;
          zip.forEach((relativePath, file) => {
            if (file.dir == true || file.name.includes("__MACOSX")) return;
            // Rename directory to match template
            const updatedPath = relativePath.replace(`${highestDir}/`, `${key}/`);
            file.name = updatedPath;
            file.async('uint8array').then(content => {
              uploadBytes(ref(storageRef, updatedPath), content, { contentType: getContentType(relativePath) });
            });
          });
        })
      }else{
        uploadBytes(ref(storageRef, key), files[key]);
      };
    }
  } catch(e){ console.log("Error while uploading files.");}
}

export default () => {
  const [name, setName] = useState();
  const [venueInfo, setVenueInfo] = useState();
  const [canSubmit, setCanSubmit] = useState(false);

  function handleInfoUpload(e){
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const info = processJSON(e.target.result);
      setName(info['site_name']);
      setVenueInfo(parseInfoJSON(info, setCanSubmit));
    }
    reader.readAsText(file);
  }

  return (
    <>
    <div className="add-container">
        <div className="add-left">
        <div className="add-heading">Create Venue</div>
        <form className="add-body" onSubmit={(e) => handleSubmit(e, canSubmit, name)}>
            <div className="input-heading">info.json *</div>
            <div className="add-item">
            <input type="file" name="info.json" accept=".json" onChange={handleInfoUpload} required/>
            </div>
            <div className="input-heading">Constraints</div>
            <div className="add-item">
            <input type="file" name="Constraint" accept=".zip" />
            </div>
            <div className="input-heading">Fingerprints</div>
            <div className="add-item">
            <label>Wi-Fi</label><input type="file" name="WifiData"  accept=".zip" />
            </div>
            <div className="add-item">
            <label>Magnetic</label><input type="file" name="MagData" accept=".zip" />
            </div>
            <div className="add-item">
            <label>i-Beacon</label><input type="file" name="iBeaconData"  accept=".zip" />
            </div>
            <div className="input-heading">Maps</div>
            <div className="add-item">
            <input type="file" name="map" accept=".zip" />
            </div>
            <div className="add-item">
            <input type="submit" disabled={!canSubmit}/>
            </div>
        </form>
        </div>
        <div className="add-right">
          <div className="add-heading">Venue Details</div>
            {venueInfo}
        </div>
    </div>
    </>
  );
};
