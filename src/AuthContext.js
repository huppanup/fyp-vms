// Handles all authorization processes

import React, { useContext, useState, useEffect } from "react"
import { auth } from "./firebase"
import { sendEmailVerification, deleteUser, reauthenticateWithCredential, EmailAuthProvider, verifyBeforeUpdateEmail, updatePassword } from "firebase/auth";

const AuthContext = React.createContext()

// Custom hook
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function verify(user) {
    return sendEmailVerification(user)
  }

  function deleteAccount(){
    return deleteUser(currentUser)
  }

  async function resetPassword(oldpw, newpw){
    const credential = EmailAuthProvider.credential(currentUser.email,oldpw)
    try{
      await reauthenticateWithCredential(
        currentUser, 
        credential
      )
      if (oldpw === newpw) return { success:false, error:"You used this password recently. Please choose a different one." };
      updatePassword(currentUser, newpw);
    return {success : true, result: "Your password has been changed successfully."}
    }catch(e){
      let error;
      switch (e.code) {
        case 'auth/invalid-login-credentials':
          error = "Your current password is incorrect.";
          break;
        case 'auth/too-many-requests':
          error = "Too many requests. Please try again later";
          break;
        default :
          console.log(e);
          error = "An unknown error has occurred. Please try again later";
      }
      return {success: false, error : error};
    }

  }

  async function resetEmail(pw, newEmail){
    try{
      const credential = EmailAuthProvider.credential(currentUser.email,pw);
      const result = await reauthenticateWithCredential(currentUser, credential);
      console.log(result);
      const ver = await currentUser.verifyBeforeUpdateEmail(newEmail);
      console.log(ver);

    } catch(e) {
      console.log(e);
    }
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    verify,
    logout,
    deleteAccount,
    resetPassword,
    resetEmail,
    // updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}