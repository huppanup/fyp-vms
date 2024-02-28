import React from "react";
import { useState } from "react";
import { ReactSVG } from "react-svg";
import '../stylesheets/sidebar.css'
import Dropdown from "react-dropdown";

export default (props) => {
    const [curTab, setCurTab] = useState(true);
    const [selFloor, setSelFloor] = useState();

    return (
    <div className={"sb-container"}>
        <div className={"sb " + (props.collapse ? "collapse" : "")}>
            <div className="sb-header">
            <Dropdown className="floor-name" options={["A","B","C"]}
                onChange={(option) => setSelFloor(option.value)}
                placeholder="Floors"
                controlClassName="myControl"
                arrowClassName="myArrow"/>
                <nav className="sb-subheading">
                    <ul className={curTab ? "selected" : ""} onClick={() => setCurTab(!curTab)}><a>Constraints</a></ul>
                    <ul className={!curTab ? "selected" : ""} onClick={() => setCurTab(!curTab)}><a>Floor Plan</a></ul>
                </nav>
            </div>
            <div className="sb-body"></div>
        </div>
        <div className="sb-tab">
            <ReactSVG id="tab" src='../tab.svg' style={{width:"50px"}} onClick={() => props.setCollapse(!props.collapse)}></ReactSVG>
        </div>
    </div>
    );
}