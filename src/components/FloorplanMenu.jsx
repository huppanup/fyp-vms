import React from "react";
import "../stylesheets/components.css"
import { addAlignmentMarkers, calculateTransformationMatrix, removeMarkers } from "../leaflet";
import { useVenue } from "../LocationContext";
import { setAlignmentBounds } from "../DBHandler";

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

export default (props) => {
  const [isManual, setIsManual] = React.useState(false);
  const [markers, setMarkers] = React.useState([]);
  const { venueID, floor, dataHandler } = useVenue();

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

  return (
    <div style={listContainerStyle}>
      {
        (venueID && floor) 
        ? isManual ? 
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button style={cancelButtonStyle} onClick={() => setIsManual(false)}>Cancel</button>
          <button style={saveButtonStyle} onClick={saveAlignment}>Save</button>
        </div> :
        <button style={alignmentButtonStyle} onClick={addMarker}>Manual Alignment</button>
        : <div></div>
      }
    </div>
  );
}
// TODO: Long messages overflow the popup body.