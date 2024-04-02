import React from "react";
import "../stylesheets/components.css"
import { addAlignmentMarkers } from "../leaflet";
import { useVenue } from "../LocationContext";
import { addMarkers } from "../pages/map";

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

export default () => {
  const [isManual, setIsManual] = React.useState(false);
  const { venueID, floor, dataHandler } = useVenue();

  const addMarker = () => {
    setIsManual(true);
  }

  return (
    <div style={listContainerStyle}>
      {
        (venueID && floor) 
        ? isManual ? 
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button style={cancelButtonStyle} onClick={() => setIsManual(false)}>Cancel</button>
          <button style={saveButtonStyle}>Save</button>
        </div> :
        <button style={alignmentButtonStyle} onClick={addMarker}>Manual Alignment</button>
        : <div></div>
      }
    </div>
  );
}
// TODO: Long messages overflow the popup body.