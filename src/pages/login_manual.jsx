
import React, {useEffect} from "react";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

export default () => {
    const [text] = React.useState('');

    return (
        <>
            <h1 className="text-center my-3 title">Login Test Page</h1>
            <input
                name="email"
                placeholder="Email"
                value={text}
            />
            <div id="email"></div>
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