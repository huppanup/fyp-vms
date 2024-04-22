import React from "react";
import "../stylesheets/components.css"
import { addAlignmentMarkers, calculateTransformationMatrix, removeMarkers } from "../leaflet";
import { useVenue } from "../LocationContext";
import { setAlignmentBounds } from "../DBHandler";
import { FaUpload } from "react-icons/fa";
import Popup from "../components/popup";
import { useNavigate } from "react-router-dom";

const listContainerStyle = {
  display: "flex",
  gap: "10px",
  flexDirection:"column",
  width: "100%",
  padding: "10px 5px",
  flex: "1",
  boxSizing:"border-box"
};

const alignmentButtonStyle = {
  width : "100%", 
  height : "45px", 
  color : "white",
  backgroundColor: "#003366",
  borderRadius: "25px",
  border: "none"
}

const cancelButtonStyle = {
  width : "49%", 
  height : "45px", 
  color : "white",
  backgroundColor: "gray",
  borderRadius: "25px",
  border: "none"
}

const saveButtonStyle = {
  width : "49%", 
  height : "45px", 
  color : "white",
  backgroundColor: "#003366",
  borderRadius: "25px",
  border: "none"
}

const fileButtonStyle = {
  width: "100%",
  height: "150px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "black",
  backgroundColor: "#fff",
  border: "1.5px dashed #003366",
  borderRadius: "20px",
}

export default (props) => {
  const [isManual, setIsManual] = React.useState(false);
  const [markers, setMarkers] = React.useState([]);
  const { venueID, floor, dataHandler } = useVenue();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [popupOpen, setPopupOpen] = React.useState(false);

  const inputRef = React.useRef();
  const navigate = useNavigate();

  const addMarker = () => {
    let alignMarkers = addAlignmentMarkers(props.map, props.imageOverlay, props.imageBounds["bottomLeft"], props.imageBounds["upperRight"], props.imageBounds["upperLeft"]);
    setMarkers(alignMarkers);
    setIsManual(true);
  }

  const saveAlignment = () => {
    let bottomLeftMarker = markers[2].getLatLng();
    let upperRightMarker = markers[1].getLatLng();
    let upperLeftMarker = markers[0].getLatLng();
    let transformationMatrix = calculateTransformationMatrix(bottomLeftMarker, upperRightMarker, upperLeftMarker, props.imageBounds["height"], props.imageBounds["width"]);
    setAlignmentBounds(venueID, floor, bottomLeftMarker, upperRightMarker, upperLeftMarker, transformationMatrix);
    props.onUpdateImageBounds({bottomLeft: bottomLeftMarker, upperRight: upperRightMarker, upperLeft: upperLeftMarker, transformation: transformationMatrix, height: props.imageBounds["height"], width: props.imageBounds["width"]})
    removeMarkers(props.map);
    setIsManual(false);
  }

  const cancelAlignment = () => {
    removeMarkers(props.map);
    setIsManual(false);
  }

  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      dataHandler.editFloorplan(venueID, floor, event.target.files[0]).then((message) => {
        setMessage(message);
        setPopupOpen(true);
      }).catch((e) => {
        setMessage(e.message);
        setPopupOpen(true);
      });
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  }

  return (
    <div style={listContainerStyle}>
      <Popup modalOpen={popupOpen} setModalOpen={setPopupOpen} message={message} navigateTo={false} />
      {
        (venueID && floor) 
        ? isManual ? 
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button style={cancelButtonStyle} onClick={cancelAlignment}>Cancel</button>
          <button style={saveButtonStyle} onClick={saveAlignment}>Save</button>
        </div> :
        <button style={alignmentButtonStyle} onClick={addMarker}>Manual Alignment</button>
        : <div></div>
      }
      {
        (venueID && floor) ?
        <div>
          <input type="file" ref={inputRef} accept="image/png, image/jpeg, images/jpg" style={{display: "none"}} onChange={handleOnChange}></input>
          <h4 style={{color: "#003366", marginTop: "10px", marginBottom: "10px"}}>Replace floorplan image</h4>
          <button style={fileButtonStyle} onClick={onChooseFile}>
            <span><FaUpload/></span> Upload File
          </button>
        </div> :
        <div></div>
      }
    </div>
  );
}
// TODO: Long messages overflow the popup body.