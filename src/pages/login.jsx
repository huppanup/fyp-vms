import React, {useState, useEffect} from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NavLink, useNavigate } from 'react-router-dom'
import {useAuth} from '../AuthContext'
import Popup from '../components/popup'
import "../stylesheets/login.css"

export default () => {
    const navigate = useNavigate();
    const { currentUser, login, logout } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const [modalOpen, setModalOpen] = React.useState(false);
    const message = "Please verify your email first.";

    useEffect(() => {
        if (currentUser !== null){
            if (!currentUser.emailVerified){
                logout()
                setModalOpen(true)
            } else {
                navigate("/home")
            } 
        }
      }, [])

    async function onLogIn(e) {
        e.preventDefault();
        try {
            await login(email,password);
            navigate("/home");
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            if (errorCode == "auth/invalid-email" || errorCode == "auth/invalid-login-credentials"){
                setErrorMessage("Incorrect email or password. Please try again.");
            } else {
                setErrorMessage(errorMessage);
            }
        }
    }

    return (
        <>
            <div className="container">
            <Popup modalOpen={modalOpen} setModalOpen={setModalOpen} message={message} navigateTo={false}/>
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
                    <p style={{color: "red", marginTop:"10px"}} className="error-message">{errorMessage}</p>
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