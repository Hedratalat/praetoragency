// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIoM8uL_WOXDy23Cs0EfoddU5tdU1Rtmw",
  authDomain: "praetor-agency.firebaseapp.com",
  projectId: "praetor-agency",
  storageBucket: "praetor-agency.firebasestorage.app",
  messagingSenderId: "406588089977",
  appId: "1:406588089977:web:cce519df8ca8f4388396a8",
  measurementId: "G-R1LBC7F4GG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

export default app;
