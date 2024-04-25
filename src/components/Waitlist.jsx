import React, { useEffect } from "react";
import { useState } from "react";
import * as icons from "react-icons/fa6";
import { getWaitlist, handleAdminRequest } from "../DBHandler";



export default () => {
    const [waitlist, setWaitlist] = useState();
    const wl = {display:"flex", gap:"20px", flexDirection:"column", padding:"20px"};
    const wlitem = {display:"flex", position:"relative", height: "40px", color:"rgba(0, 0, 0, 0.75)", borderRadius:"10px",
    backgroundColor:"white", boxShadow:"0px 2px 4px rgba(0, 0, 0, 0.25)", 
    verticalAlign:"center", alignItems:"center", padding:"20px"};
    const approvelist = {
        width: "200px",
        maxHeight: "200px",
        overflowY: "scroll",
        fontSize: "small",
        right:"20px",
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
        top: "50px",
        zIndex: "10",
    };

    const WaitlistItem = (({item}) => {
        const [isExpanded, setIsExpanded] = useState(false);
        
        return (
        <div className="waitlist-item" style={wlitem}>
            <div style={{width:"95%"}}>{item.value.email}</div>
            <icons.FaEllipsisVertical onClick={() => setIsExpanded(!isExpanded)}/>
            {isExpanded && (
                <ul className="waitlist-menu" style={approvelist}>
                    <li className="settings-item" key="${item.key} + 0" onClick={() => handleAdminRequest(true, item.key)}>Approve</li>
                    <li className="settings-item" key="${item.key} + 1" onClick={() => handleAdminRequest(false, item.key)}>Reject</li>
                </ul>
            )}
        </div>
        )
    })

    useEffect(() => {
        getWaitlist(setWaitlist);
    },[]);

    return (
    <div style={wl}>
        {
            waitlist && Object.entries(waitlist).map(([key, value]) => {
                return (<WaitlistItem item={{key: key, value: value}} />)
            })
        }
    </div>
    );
}