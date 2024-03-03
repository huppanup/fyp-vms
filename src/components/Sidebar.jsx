import React, { useEffect } from "react";
import { useState } from "react";
import { ReactSVG } from "react-svg";
import '../stylesheets/sidebar.css'
//import Dropdown from "react-dropdown";
import Dropdown from "../components/Dropdown"
import ConstraintMenu from "./ConstraintMenu";
import FloorplanMenu from "./FloorplanMenu";
import { useVenue } from '../LocationContext';


export default (props) => {
    const { venueID, floor, setFloor, venueInfo, dataHandler } = useVenue();

    const [curTab, setCurTab] = useState(true);

    return (
    <div className={"sb-container"}>
        <div className={"sb " + (props.collapse ? "collapse" : "")}>
            <div className="sb-header">
                <Dropdown options={venueInfo ? venueInfo["floors"] : []}
                    onChange={(f) => setFloor(f)}
                    placeholder={"Select a floor"}
                />
                <div className="sb-tabs">
                    <div className={"sb-tab" + (curTab ? " selected" : "")} onClick={() => setCurTab(true)}><div style={{padding: "10px 0px"}}>Constraints</div></div>
                    <div className={"sb-tab" + (!curTab ? " selected" : "")} onClick={() => setCurTab(false)}><div style={{padding: "10px 0px"}}>Floor Plan</div></div>
                </div>
            </div>
            <div className="sb-body" style={{flex: "1", whiteSpace:"normal", wordBreak:"break-all", overflow:"scroll"}}>
                { curTab ? (<ConstraintMenu currentFloor={floor}/>) : (<FloorplanMenu></FloorplanMenu>)}
            </div>
        </div>
        <div className="sb-collapse">
            <ReactSVG id="collapse" src='../tab.svg' style={{width:"50px"}} onClick={() => props.setCollapse(!props.collapse)}></ReactSVG>
        </div>
    </div>
    );
}