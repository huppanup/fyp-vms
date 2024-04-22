import firebase from "firebase/compat/app"
import "firebase/compat/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBkOFKWEsmveWoQtufuBVQKlT6t8bRfbCU",
  authDomain: "fyp-vms-4c56e.firebaseapp.com",
  projectId: "fyp-vms-4c56e",
  storageBucket: "fyp-vms-4c56e.appspot.com",
  messagingSenderId: "622719935238",
  appId: "1:622719935238:web:a01c1a6d67c8d4a8a7f487",
  measurementId: "G-ZK0NSJW8TV",
  databaseURL: "https://fyp-vms-4c56e-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Detect authorization state

// onAuthStateChanged(auth, user => {
//     if (user != null) {
//         console.log('logged in');
//     } else {
//         console.log('No user.');
//     }
// })

export {app, auth, db, database, storage, firestore} ;

