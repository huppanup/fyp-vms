import React from "react";
import { MenuItem } from 'react-pro-sidebar';


const customStyles = {
    width: "100%",
    height: "100%",
    overflow: "scroll",
    
  };

export default () => {
    return (
        <div className="scrollable-list" style={customStyles}>
            
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint1</MenuItem>
        <MenuItem>Constraint2</MenuItem>
        </div>
    );
}
// TODO: Long messages overflow the popup body.