import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import {app, auth, db} from '../firebase';
import { getAuth } from "firebase/auth";
import { NavLink, useNavigate } from 'react-router-dom';



export default () => {
    const navigate = useNavigate();
    let link;

    auth.onAuthStateChanged(function(user) {
        if (user != null) {
            console.log("Logged in");
            console.log("Redirecting to main page");
            link = "/home";
        } else {
            console.log("No user");
            console.log("Redirecting to login");
            link = "/login";
        };
    });
    
    useEffect(() => {
        navigate(link);
    });
    
    return;
}