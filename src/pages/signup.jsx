
import React from "react";
import validator from 'validator';
import Popup from "../components/popup";
import {useAuth} from '../AuthContext'
import { addUser } from "../DBHandler";

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";


export default () => {
    const {signup, verify, logout} = useAuth();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [modalOpen, setModalOpen] = React.useState(false);
    const [link, setLink] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [checkPassword, setCheckPassword] = React.useState('');
    const [signUpReady, setSignUpReady] = React.useState(0);
    const [pwStrength, setpwStrength] = React.useState('');
    const pwStrengthMessage = ['Password Strength: Strong', 'Password Strength: Weak. Your password should be at least 8 characters long, including 1 lowercase, number, and symbol.'];
    const auth = getAuth();

    const actionCodeSettings ={
        url: 'http://localhost:3000',
        handleCodeInApp: true,
    };
    const clearInput = () => {
        setEmail('');
        setPassword('');
        setCheckPassword('');
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        try{
            const user = await signup(email, password);
            console.log(user);
            addUser(user.user.uid);
            await verify(user.user);
            setModalOpen(true);
            setLink('/login');
            setMessage("Your account has been successfully created! Please check your inbox to verify your account.");
            logout();

        } catch(error) {
            if (error.code === "auth/email-already-in-use"){
                setMessage(email + " is already in use. Please try again with a different email.");              
            } else {
                setMessage(error.message);
            }
                setModalOpen(true);
                clearInput();
        };
    };

    const validatePassword = (value) => {
        if (validator.isStrongPassword(value, { 
            minLength: 8, minLowercase: 1, minUppercase: 0,
            minNumbers: 1, minSymbols: 1 
        })) { 
            setpwStrength(0);
        } else { 
            setpwStrength(1); 
        } 
        if (checkPassword){
            setCheckPassword('');
        }
        setPassword(value);
    }

    const matchPassword = (value) => {
        if (password === value){
            setSignUpReady(1);
        } else {
            setSignUpReady(0);
        }
        setCheckPassword(value);
    }

    return (
        <>
            <div className="container">
            <Popup modalOpen={modalOpen} setModalOpen={setModalOpen} message={message} navigateTo={link}/>
            <div className="login-module">
            <div className="login-contents">
            <h1 className="text-center title">Create Account</h1>
            <form className="login-form">
            <div className="form-input">
            <label htmlFor="password">
                        E-mail
                    </label>
            <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            </div>
            <div className="form-input">
            <label htmlFor="password">
                        Password
                    </label>
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={e => validatePassword(e.target.value)}
            />
            { (pwStrength === 1) && (<p style={{color: "red"}} className="error-message">{pwStrengthMessage[pwStrength]}</p>)}
            { (pwStrength === 0) && (<p style={{color: "green"}} className="error-message">{pwStrengthMessage[pwStrength]}</p>)}
            </div>
            <div className="form-input">
            <input
                type="password"
                name="checkPassword"
                placeholder="Re-enter password"
                value={checkPassword}
                disabled={ pwStrength ? true : false}
                onChange={e => matchPassword(e.target.value)}
            />
            { (pwStrength === 0) && (checkPassword !== '') && (signUpReady===0) && (<p style={{color: "red"}} className="error-message">Password does not match.</p>)}
            </div>
            <button className="login-button" variant="contained" disabled={ (signUpReady && email) ? false : true} onClick={onSubmit}>SIGN UP</button>
            <div id="email"></div>
            </form>
            </div>
            </div>
            </div>
        </>
    )
}