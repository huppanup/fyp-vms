import React from "react";
import { useLocation } from "react-router-dom";
import { MenuItem } from 'react-pro-sidebar';
import { FaEllipsisV } from "react-icons/fa";

import VenueData from '../VenueDataHandler';

const customStyles = {
    width: "100%",
    height: "100%",
    overflow: "scroll",
};

const constraintsStyles = {
    height: "60px",
    backgroundColor: "rgba(0, 90, 180, 0.05)",
    borderRadius: "15px",
    width: "95%",
    margin: "auto",
    marginTop: "5px",
    marginBottom: "5px"
};

const constraintsH4Styles = {
    marginTop: "0px",
    marginBottom: "5px",
    color:"#003366",
    marginRight: "auto"
};

const menuItemContainerStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
};

export default (props) => {
    const [constraintsInfo, setConstraintsInfo] = React.useState({});

    const location = useLocation();
    const currentVenue = new VenueData(location.pathname.split('/').pop(), props.currentFloor);
    React.useEffect(() => {
        currentVenue.getAllConstraints().then((data) => setConstraintsInfo(data))
    },[]);
    React.useEffect(() => {
        currentVenue.floor = props.currentFloor;
        currentVenue.getAllConstraints().then((data) => setConstraintsInfo(data))
    },[props.currentFloor]);

    const handleConstraintEdit = (currentVenue, floor, type, id, x, y) => {
        currentVenue.floor = floor;
        currentVenue.editConstraint(type, id, x, y).then((data) => {
            console.log(data);
        })
    };
    
    return (
        <div className="scrollable-list" style={customStyles}>
            {
            constraintsInfo && constraintsInfo.in &&
                constraintsInfo.in.map((item) => (
                        <MenuItem key={"in" + item.id} style={constraintsStyles}>
                            <div style={menuItemContainerStyles}>
                                <h4 style={constraintsH4Styles}>In-constraint</h4>
                                <span><FaEllipsisV size={15} style={{ color: '#003366' }} onClick={() => handleConstraintEdit(currentVenue, props.currentFloor, "in", item.id, item.x, item.y)}/></span>
                            </div>
                            {item.x} {item.y}
                        </MenuItem>
                ))
            }
            {
            constraintsInfo && constraintsInfo.out &&
                constraintsInfo.out.map((item) => (
                    <MenuItem key={"out" + item.id} style={constraintsStyles}>
                        <div style={menuItemContainerStyles}>
                            <h4 style={constraintsH4Styles}>Out-constraint</h4>
                            <span><FaEllipsisV size={15} style={{ color: '#003366' }} onClick={() => handleConstraintEdit(currentVenue, props.currentFloor, "out", item.id, item.x, item.y)}/></span>
                        </div>
                        {item.x} {item.y}
                    </MenuItem>
                ))
            }
            {

            }
        </div>
    );
}
// TODO: Long messages overflow the popup body.