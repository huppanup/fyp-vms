import React, {useState} from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NavLink, useNavigate } from 'react-router-dom'
import "../stylesheets/login.css"

export default () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const auth = getAuth();

    const onLogIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            navigate("/home");
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            setErrorMessage(errorMessage);
        });
    }

    return (
        <>
            <div className="container">
            <div className="login-module">
            <div className="login-contents">
            <h1 className="text-center title">Welcome!</h1>
            <form className="login-form">
                <div className="form-input">
                    <label htmlFor="email-address">
                        Email address
                    </label>
                    <input
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="E-mail"
                    />
                </div>
                <div className='form-input'>
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
                        onClick={onLogIn}>
                        LOG IN
                    </button>
                </div>
                { errorMessage && (
                    <p style={{color: "red"}} className="error-message">{errorMessage}</p>
                )}
            </form>
            <p>
                No account yet? {' '}
                <NavLink to="/signup" >
                    Sign Up
                </NavLink>
            </p>
            </div>
            </div>
            </div>
        </>
    )
}