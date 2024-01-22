
import React, {useEffect} from "react";
import {app, auth, db} from '../firebase';
import firebase from 'firebase/compat/app';
import { NavLink, useNavigate } from 'react-router-dom';
import validator from 'validator';
import Popup from "../components/popup";

import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, validatePassword } from "firebase/auth";


export default () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [modalOpen, setModalOpen] = React.useState(false);
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

    const onSubmit = async (e) => {
        e.preventDefault();
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                verify();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode == "auth/email-already-in-use"){
                    setMessage(email + " is already in use. Please try again with a different email.");
                    setModalOpen(true);
                    setEmail('');
                }
            });
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
        setPassword(value);
    }

    const matchPassword = (value) => {
        if (password == value){
            setSignUpReady(1);
        } else {
            setSignUpReady(0);
        }
        setCheckPassword(value);
    }

    const verify = () => {
        sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
            setModalOpen(true);
            setMessage("Your account has been successfully created! Please check your inbox to verify your account.");

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        })

    };

    return (
        <>
            <div className="container">
            <Popup modalOpen={modalOpen} setModalOpen={setModalOpen} message={message} />
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
            { (pwStrength == 1) && (<p style={{color: "red"}} className="error-message">{pwStrengthMessage[pwStrength]}</p>)}
            { (pwStrength == 0) && (<p style={{color: "green"}} className="error-message">{pwStrengthMessage[pwStrength]}</p>)}
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
            { (pwStrength == 0) && (checkPassword != '') && (signUpReady==0) && (<p style={{color: "red"}} className="error-message">Password does not match.</p>)}
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