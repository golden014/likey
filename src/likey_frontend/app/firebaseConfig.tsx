import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAM-0bjFORdNKsa4s-OitoMEDNWPV_uIbo",
  authDomain: "likey-23003.firebaseapp.com",
  databaseURL: "https://likey-23003-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "likey-23003",
  storageBucket: "likey-23003.appspot.com",
  messagingSenderId: "348882283388",
  appId: "1:348882283388:web:cafb6d928904f624b0d2f9",
  measurementId: "G-JKHRPNQK66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database }