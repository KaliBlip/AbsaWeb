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
firebase.initializeApp(firebaseConfig);

// Firestore and Auth references
const db = firebase.firestore();
const auth = firebase.auth();
