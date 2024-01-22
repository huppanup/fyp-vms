import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default () => {
    const navigate = useNavigate();
    console.log("Redirecting to login");
    useEffect(() => {
        navigate("/login");
    })
    return;
}