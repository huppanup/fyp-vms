import React, { useEffect } from "react";
import { useState } from "react";
import * as icons from "react-icons/fa6";



export default () => {
    const wl = {display:"flex", gap:"20px", flexDirection:"column", padding:"20px"};
    const wlitem = {display:"flex", height: "40px", color:"rgba(0, 0, 0, 0.75)", borderRadius:"10px",
    backgroundColor:"white", boxShadow:"0px 2px 4px rgba(0, 0, 0, 0.25)", 
    verticalAlign:"center", alignItems:"center", padding:"20px"};
    const approvelist = {
        width: "200px",
        maxHeight: "200px",
        overflowY: "scroll",
        fontSize: "small",
        right:"48px",
        position: "absolute",
        border: "solid 0.5px #5a5a5a3e",
        borderRadius: "10px",
        boxSizing: "border-box",
        padding: 0,
        listStyleType: "none",
        backgroundColor: "white",
        marginTop: "10px",
        userSelect: "none",
        color: "#003366",
        top: "20vh"
    };

    return (
    <div style={wl}>
        <div className="waitlist-item" style={wlitem}><div style={{width:"95%"}}>sample@gmail.com</div><icons.FaEllipsisVertical/></div>
        <div className="waitlist-item" style={wlitem}><div style={{width:"95%"}}>sample2@gmail.com</div><icons.FaEllipsisVertical/></div>
        <ul style={approvelist}>
            <li className="settings-item" key="0">Approve</li>
            <li className="settings-item" key="1">Reject</li>
        </ul>
    </div>
    );
}