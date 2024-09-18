// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_YzLE3_fBF4k0Vjw_9sMiN6Ji0f8uzZQ",
  authDomain: "absa-web.firebaseapp.com",
  projectId: "absa-web",
  storageBucket: "absa-web.appspot.com",
  messagingSenderId: "432456390237",
  appId: "1:432456390237:web:b63272569b8f81c9f49fb4",
  measurementId: "G-14JPDKMLP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
