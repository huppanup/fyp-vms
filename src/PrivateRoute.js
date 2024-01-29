import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext"


export const PrivateRoute = () => {
    const { currentUser } = useAuth();
    return (currentUser && currentUser.emailVerified) ? <Outlet />: <Navigate to="/login" />;
};