// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5Ok6rOZD5jtXbIc8mwd-51MdoO9q-O8g",
  authDomain: "nmss-planner.firebaseapp.com",
  projectId: "nmss-planner",
  storageBucket: "nmss-planner.firebasestorage.app",
  messagingSenderId: "674132954321",
  appId: "1:674132954321:web:95dacdf1df1696ebe689f0",
  measurementId: "G-LXKCYH2392"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);