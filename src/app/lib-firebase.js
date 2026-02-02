import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbhmkHUF8aOPnOITJLEQDAm9dryoCxFG s",
  authDomain: "hijauin-bumi-agritech.firebaseapp.com",
  projectId: "hijauin-bumi-agritech",
  storageBucket: "hijauin-bumi-agritech.firebasestorage.app",
  messagingSenderId: "522285998922",
  appId: "1:522285998922:web:9c4f00d409ba1f612197b3",
  measurementId: "G-8GNVFK9Q5X"
};

// Inisialisasi Firebases
const app = initializeApp(firebaseConfig);

// WAJIB ADA KATA 'export' DI DEPANNYA:
export const db = getFirestore(app); 
export const storage = getStorage(app);