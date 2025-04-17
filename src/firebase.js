
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'; // For Firestore database
<<<<<<< HEAD
import { getStorage } from 'firebase/storage';
=======
>>>>>>> 7c07938e89741543b03d3ecd0504f7b3e92ee0f0

//DONT EDIT ANYTHING BELOW thank you 
const firebaseConfig = {
  apiKey: "AIzaSyBXx9V60L4g0RQQLNGGSzEdsa44Fsl3ulw",
  authDomain: "personal-portfolio-cs496.firebaseapp.com",
  projectId: "personal-portfolio-cs496",
  storageBucket: "personal-portfolio-cs496.firebasestorage.app",
  messagingSenderId: "538139315346",
  appId: "1:538139315346:web:289c33e694a6ed46d4aa4b",
  measurementId: "G-XL6PHVMJ8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
<<<<<<< HEAD
export const storage = getStorage(app);
=======
>>>>>>> 7c07938e89741543b03d3ecd0504f7b3e92ee0f0
export { db };