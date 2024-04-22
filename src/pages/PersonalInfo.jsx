
import React, { useState } from "react";
import validator from 'validator';
import "../stylesheets/personalinfo.css";
import { LargeButton } from "../components/LargeButton";
import * as icons from "react-icons/fa6";
import Popup from "../components/popup";
import Waitlist from "../components/Waitlist";


import { useAuth } from "../AuthContext";

export default () => {
    const auth = useAuth();

    const [passwordInput,setPasswordInput] = useState(false);
    const [emailInput, setEmailInput] = useState(false);
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [oldpassword, setOldpassword] = React.useState('');
    const [validPw, setValidPw] = React.useState('');
    const [pwStrength, setpwStrength] = React.useState('');
    const pwStrengthMessage = ['','Password Strength: Strong', 'Password Strength: Weak. Your password should be at least 8 characters long, including 1 lowercase, number, and symbol.'];
    const pwMatchMessage = ['', 'Password does not match','Verified.'];


    const changeEmail = () => {setEmailInput(true)};
    const changePassword = () => {setPasswordInput(true)};

    const submitEmail = () => {      
        auth.resetEmail(oldpassword, email).then((result) => {
            result.success && (alert(result.message));
            !result.success && (alert(result.error));
        });
        setEmailInput(false);
        setEmail('');
        setOldpassword('');
    };

    const submitPassword = () => {
        if (validPw === 2 && pwStrength === 1){
            auth.resetPassword(oldpassword,password).then((result) => {
                result.success && (alert("Password successfully changed"));
                !result.success && (alert(result.error));
            });
        }else{
            alert("Please recheck the input fields.");
        }
        setPasswordInput(false);
        setOldpassword('');
        setPassword('');
        setValidPw('');
        setpwStrength('');
    };


    const validatePassword = (value) => {
        if (validator.isStrongPassword(value, { 
            minLength: 8, minLowercase: 1, minUppercase: 0,
            minNumbers: 1, minSymbols: 1 
        })) { 
            setpwStrength(1);
        } else { 
            setpwStrength(2); 
        } 
        document.getElementById("checkPw").value = '';
        setPassword(value);
    }
    const matchPassword = (value) => {
        if (value === ''){
            setValidPw('');
        } else if (value === password) {
            setValidPw(2);
        } else {
            setValidPw(1);
        }
    }

    const emailField =(
        <>
        <tr><td className="personal-table-label">New Email</td><td className="personal-table-value"><input type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input></td></tr>
        <tr><td className="personal-table-label">Current Password</td><td className="personal-table-value"><input type="password" value = {oldpassword} onChange={(e) => setOldpassword(e.target.value)}></input></td></tr>
        </>);

    const passwordField =(
            <>
            <tr><td className="personal-table-label">Current Password</td><td className="personal-table-value"><input type="password" value = {oldpassword} onChange={(e) => setOldpassword(e.target.value)}></input></td></tr>
            <tr className="row-message"><td className="personal-table-label">New Password</td><td className="personal-table-value"><input type="password" value = {password} onChange={(e) => validatePassword(e.target.value)}></input></td>
            </tr>
            {pwStrength && <tr><td className="col-message" colspan="2" style={pwStrength === 1 ? {color: "green"} : {color:"red"}}>{pwStrengthMessage[pwStrength]}</td></tr>}
            <tr className="row-message"><td className="personal-table-label">Re-enter Password</td><td className="personal-table-value"><input id="checkPw" type="password" disabled={ pwStrength === 2 ? true : false} onChange={(e) => matchPassword(e.target.value)}></input></td></tr>
            {validPw && <tr><td className="col-message" colspan="2" style={validPw === 2 ? {color: "green"} : {color:"red"}}>{pwMatchMessage[validPw]}</td></tr>}
            </>);

    return (
        <>
        <div className="personalinfo-container">
        <div id="personal-overview" className="personal-body">
            <div className="personal-items" id="personal-heading">Account Overview</div>
            <div className="personal-items">
                <table id="personal-table">
                    <tbody>
                        <tr><td className="personal-table-label">Email</td><td className="personal-table-value">{auth.currentUser.email}</td></tr>
                        { emailInput && emailField }
                        { passwordInput && passwordField}
                    </tbody>
                </table>
            </div>
            <div className="personal-items" style={{display:"flex"}}>
                {!emailInput && !passwordInput && 
                (<><div style={{height:"50px", width:"190px"}}><LargeButton icon={<icons.FaEnvelope/>} value="Change Email" width="190px" onClick={changeEmail}/></div>
                <div style={{height:"50px", width:"190px"}}><LargeButton icon={<icons.FaKey/>} value="Edit Password" width="190px" onClick={changePassword}/></div></>)}
                {emailInput && <div style={{height:"50px", width:"190px"}}><LargeButton icon={<icons.FaEnvelope/>} value="Verify Email" width="190px" onClick={submitEmail}/></div>}
                {passwordInput && <div style={{height:"50px", width:"190px"}}><LargeButton icon={<icons.FaKey/>} value="Apply Changes" width="190px" onClick={submitPassword} active={!(pwStrength === 1 && validPw === 2)}/></div>}

            </div>
        </div>
        <div id="personal-role" className="personal-body">
        <div className="personal-items" id="personal-heading" style={{alignItems:"center",justifyContent:"center"}}></div>

            {/*<Waitlist />*/}
        </div>
        </div>
    </>
    )
}