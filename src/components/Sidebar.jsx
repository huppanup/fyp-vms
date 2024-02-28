import React from "react";
import { useState } from "react";
import { ReactSVG } from "react-svg";
import '../stylesheets/sidebar.css'


export default (props) => {
    const [collapse, setCollapse] = useState(false);

    return (
    <div className={"sidebar-container " + (collapse ? "collapse" : "expand")}>
        <div className="sidebar">
            Sidebar
        </div>
        <div className="sidebar-tab">
            <ReactSVG id="tab" src='./tab.svg' style={{width:"50px"}} onClick={()=>setCollapse(!collapse)}>왜</ReactSVG>
        </div>
    </div>
    );
}