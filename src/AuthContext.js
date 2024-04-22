// Handles all authorization processes

import React, { useContext, useState, useEffect } from "react"
import { auth, firestore } from "./firebase"
import { sendEmailVerification, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import {doc, setDoc} from 'firebase/firestore'

const AuthContext = React.createContext()

// Custom hook
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  async function signup(email, password) {
    const user = (await auth.createUserWithEmailAndPassword(email, password));
    await setDoc(doc(firestore,"users",user.user.uid),{likedLocations:{}, type:0}); // Creates user with default type 'viewer'
    return user;
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
      const ver = await currentUser.verifyBeforeUpdateEmail(newEmail);
      return {success: true, message: "A verification link has been sent to your new email address confirm the changes. If you don't see any email from us, your new email address may already be in use."}
    } catch(e) {
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