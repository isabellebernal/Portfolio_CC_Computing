
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'; // For Firestore database
import { getStorage } from 'firebase/storage';

//DONT EDIT ANYTHING BELOW thank you 
const firebaseConfig = {
  apiKey: "AIzaSyBXx9V60L4g0RQQLNGGSzEdsa44Fsl3ulw",
  authDomain: "personal-portfolio-cs496.firebaseapp.com",
  projectId: "personal-portfolio-cs496",
  storageBucket: "personal-portfolio-cs496.appspot.com",
  messagingSenderId: "538139315346",
  appId: "1:538139315346:web:289c33e694a6ed46d4aa4b",
  measurementId: "G-XL6PHVMJ8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app); // Error: 'getStorage' is not defined