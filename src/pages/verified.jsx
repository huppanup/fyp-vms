import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


export default () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const auth = getAuth();

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
                setErrorMessage(errorMessage);
            });
    };

    return (
        <>
            <h1 className="text-center my-3 title">Sign Up</h1>
            <form className="signup-form">
                <div>
                    <label htmlFor="email-address">
                        Email address
                    </label>
                    <input
                        type="email"
                        label="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email address"
                    />
                </div>
                <div>
                    <label htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button className="login-button"
                        type="submit"
                        onClick={onSubmit}>
                        Sign up
                    </button>
                </div>
                { errorMessage && (
                    <p style={{color: "red"}} className="error-message">{errorMessage}</p>
                )}
            </form>
            <p>
                Already have an account?{' '}
                <NavLink to="/login_template" >
                    Sign in
                </NavLink>
            </p>
        </>
    )
}