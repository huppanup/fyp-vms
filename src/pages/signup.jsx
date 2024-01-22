
import React, {useEffect} from "react";
import {app, auth, db} from '../firebase';
import firebase from 'firebase/compat/app';
import { NavLink, useNavigate } from 'react-router-dom';
import validator from 'validator';

import { getAuth, createUserWithEmailAndPassword, sendSignInLinkToEmail, validatePassword } from "firebase/auth";


export default () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('')
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
                navigate("/login");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
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
        console.log(actionCodeSettings);
        sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
            console.log("Email sent")
            alert("Please check your email for the verification link.")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        })

    };

    return (
        <>
            <div className="container">
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