import React from "react";

const listContainerStyle = {
  display: "flex",
  gap: "10px",
  flexDirection:"column",
  width: "100%",
  padding: "10px 5px",
  flex: "1",
  boxSizing:"border-box"
};

export default () => {
    return (
      <div id="listContainer" style={listContainerStyle}>
        
      </div>
    );
}
// TODO: Long messages overflow the popup body.