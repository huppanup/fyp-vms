import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkOFKWEsmveWoQtufuBVQKlT6t8bRfbCU",
  authDomain: "fyp-vms-4c56e.firebaseapp.com",
  projectId: "fyp-vms-4c56e",
  storageBucket: "fyp-vms-4c56e.appspot.com",
  messagingSenderId: "622719935238",
  appId: "1:622719935238:web:a01c1a6d67c8d4a8a7f487",
  measurementId: "G-ZK0NSJW8TV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const analytics = getAnalytics(app);
export const db = getFirestore(app);

// Detect authorization state

onAuthStateChanged(auth, user => {
    if (user != null) {
        console.log('logged in');
    } else {
        console.log('No user.');
    }
})

export default auth;

