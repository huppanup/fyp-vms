import React, { useEffect } from "react";
import { useState } from "react";
import { ReactSVG } from "react-svg";
import '../stylesheets/sidebar.css'
//import Dropdown from "react-dropdown";
import Dropdown from "../components/Dropdown"
import ConstraintMenu from "./ConstraintMenu";
import FloorplanMenu from "./FloorplanMenu";
import { useVenue } from '../LocationContext';
import { useAuth } from '../AuthContext';


export default (props) => {
    const { floor, setFloor, venueInfo, loading } = useVenue();
    const  {isAdmin} = useAuth();

    const [curTab, setCurTab] = useState(true);
    const [floorList, setFloorList] = useState([]);

    useEffect(() => {
        if (!venueInfo) return;
        const floors = {};
        venueInfo["floors"].map((floor) => {floors[floor] = floor});
        setFloorList(floors);
        
    }, [venueInfo])

    return (
    <div className={"sb-container"}>
        <div className={"sb " + (props.collapse ? "collapse" : "")}>
            <div className="sb-header">
                <Dropdown 
                    id="floorList"
                    options={floorList}
                    onSelected={(f) => setFloor(f)}
                    placeholder={"Select a floor"}
                    curSelected={floor}
                    active={!loading}
                />
                <div className="sb-tabs">
                    <div className={"sb-tab" + (curTab ? " selected" : "")} onClick={() => setCurTab(true)}><div style={{padding: "10px 0px"}}>Constraints</div></div>
                    {isAdmin === 1 && <div className={"sb-tab" + (!curTab ? " selected" : "")} onClick={() => setCurTab(false)}><div style={{padding: "10px 0px"}}>Floor Plan</div></div>}
                </div>
            </div>
            <div className="sb-body" style={{flex: "1", whiteSpace:"normal", wordBreak:"break-all", overflow:"scroll"}}>
                { curTab ? (<ConstraintMenu map={props.map} imageBounds={props.imageBounds} currentFloor={floor}></ConstraintMenu>) : (<FloorplanMenu map={props.map} imageOverlay={props.imageOverlay} imageBounds={props.imageBounds} onUpdateImageBounds={props.onUpdateImageBounds}></FloorplanMenu>)}
            </div>
        </div>
        <div className="sb-collapse">
            <ReactSVG id="collapse" src='../tab.svg' style={{width:"50px"}} onClick={() => props.setCollapse(!props.collapse)}></ReactSVG>
        </div>
    </div>
    );
}