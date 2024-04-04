
import React from "react";
import "../stylesheets/personalinfo.css";
import { LargeButton } from "../components/LargeButton";
import * as icons from "react-icons/fa6";
import Popup from "../components/popup";

import { useAuth } from "../AuthContext";

export default () => {
    const auth = useAuth();

    const changeEmail = () => {console.log("Change Email")};
    const changePassword = () => {console.log("Change Password")};

    return (
        <>
            <div className="container">
            <div id="personal-overview" className="personal-body">
                <div className="personal-items" id="personal-heading">Account Overview</div>
                <div className="personal-items">
                    <table id="personal-table">
                        <tbody>
                            <tr><td className="personal-table-label">Email</td><td className="personal-table-value">{auth.currentUser.email}</td></tr>
                            <tr><td className="personal-table-label">Password</td><td className="personal-table-value">*****</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="personal-items" style={{display:"flex"}}>
                    <div style={{height:"50px", width:"190px"}}><LargeButton icon={<icons.FaEnvelope/>} value="Change Email" width="190px" onClick={changeEmail}/></div>
                    <div style={{height:"50px", width:"190px"}}><LargeButton icon={<icons.FaKey/>} value="Edit Password" width="190px" onClick={changePassword}/></div>
                </div>
            </div>
            <div id="personal-role" className="personal-body">
                Temp
            </div>
            </div>
        </>
    )
}