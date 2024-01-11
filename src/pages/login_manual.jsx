
import React, {useEffect} from "react";
import firebase from 'firebase/compat/app';

import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { NavLink, useNavigate } from 'react-router-dom'


export default () => {
    const [email, setEmail] = React.useState('');
    const auth = getAuth();
    /*
    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: 'http://localhost:3000/login_manual/?email=' + firebase.auth().currentUser.email,
        handleCodeInApp: true,
      };
    */
    const actionCodeSettings ={
        url: 'http://localhost:3000',
        handleCodeInApp: true,
    };

    const verify = () => {
        sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            console.log("Email sent")
            // window.localStorage.setItem('emailForSignIn', email);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        })
    };
    return (
        <>
            <h1 className="text-center my-3 title">Login Test Page</h1>
            <input
                name="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <button variant="contained" onClick={verify}>VERIFY</button>
            <div id="email"></div>
            <p>
                Already have an account?{' '}
                <NavLink to="/login_template" >
                    Sign in
                </NavLink>
            </p>
        </>
    )
}
/*
const auth = getAuth();
sendSignInLinkToEmail(auth, email, actionCodeSettings)
  .then(() => {
    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', email);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });
*/