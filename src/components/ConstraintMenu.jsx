import React from "react";
import { useLocation } from "react-router-dom";
import { MenuItem } from 'react-pro-sidebar';
import { FaEllipsisV } from "react-icons/fa";

import VenueData from '../VenueDataHandler';

const constraintItemStyle = {
    display: "flex",
    padding: "10px",
    height: "50px",
    gap: "15px",
    borderRadius : "10px",
    boxShadow: "0 2px 3px #5f5f5f43"
}

const optionStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent:"center",
    flex: "1",
    flexGrow: "0",
    flexShrink:"0"
}

const circle = {
    height:"100%",
    aspectRatio:"1/1",
    boxShadow: "0 2px 3px #5f5f5f43",
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent:"center",
    fontWeight: "bolder",
}

const listContainerStyle = {
    display: "flex",
    gap: "10px",
    flexDirection:"column",
    width: "100%",
    padding: "10px 5px",
    overflow: "scroll",
    flex: "1",
    boxSizing:"border-box"
};

const constraintStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    width: "200px",
    overflow: "hidden"
}

const constraintTextStyle = {
    flex: "1",
    whiteSpace:"nowrap",
    overflow: "hidden",
    textOverflow:"ellipsis",
    fontSize: "14px"
}

function ConstraintItem({type, id, x, y}){
    return (
        <div style={constraintItemStyle}>
        { type === "in" ? <div style={Object.assign({}, circle, {color:"#003366", backgroundColor:"white"})}>IN</div> : <div style={Object.assign({}, circle, {color:"white", backgroundColor:"#003366"})}>OUT</div> 
        } <div style={constraintStyle}><div style={constraintTextStyle}>{x}</div><div style={constraintTextStyle}>{y}</div></div><div  style={optionStyle} ><FaEllipsisV/></div>
        </div>
    )
}

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
        <div id="listContainer" style={listContainerStyle}>
            <ConstraintItem type="in" x="14.3382923428" y="23.4813849"></ConstraintItem>
            <ConstraintItem type="out" x="14.338" y="23.481"></ConstraintItem>
            <ConstraintItem></ConstraintItem>
            <ConstraintItem></ConstraintItem>
            <ConstraintItem></ConstraintItem>
            <ConstraintItem></ConstraintItem>
            <ConstraintItem></ConstraintItem>
            <ConstraintItem></ConstraintItem>
            
            {/* {
            {/* {
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

            } */}
        </div>
    );
}
// TODO: Long messages overflow the popup body.