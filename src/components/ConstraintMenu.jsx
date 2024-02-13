import React from "react";
import { useLocation } from "react-router-dom";
import { MenuItem } from 'react-pro-sidebar';

import VenueData from '../VenueDataHandler';

const customStyles = {
    width: "100%",
    height: "100%",
    overflow: "scroll",
    
  };

export default (props) => {
    const [constraintsInfo, setConstraintsInfo] = React.useState({});
    const location = useLocation();
    const currentVenue = new VenueData(location.pathname.split('/').pop(), props.curFloor);
    React.useEffect(() => {
        currentVenue.getAllConstraints().then((data) => setConstraintsInfo(data))
    },[]);
    React.useEffect(() => {
        currentVenue.floor = props.currentFloor;
        currentVenue.getAllConstraints().then((data) => setConstraintsInfo(data))
    },[props.currentFloor]);
    return (
        <div className="scrollable-list" style={customStyles}>
            {
            constraintsInfo.in &&
                constraintsInfo.in.map((item) => (
                        <MenuItem key={"in" + item.id}>In-constraint {item.x} {item.y}</MenuItem>
                ))
            }
            {
            constraintsInfo.out &&
                constraintsInfo.in.map((item) => (
                        <MenuItem key={"out" + item.id}>Out-constraint {item.x} {item.y}</MenuItem>
                ))
            }
        </div>
    );
}
// TODO: Long messages overflow the popup body.