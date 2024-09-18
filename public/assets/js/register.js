
import { getFirestore, doc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

// Import Firebase auth and db from firebase.js
import { auth, db } from './firebase.js';



// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_YzLE3_fBF4k0Vjw_9sMiN6Ji0f8uzZQ",
  authDomain: "absa-web.firebaseapp.com",
  projectId: "absa-web",
  storageBucket: "absa-web.appspot.com",
  messagingSenderId: "432456390237",
  appId: "1:432456390237:web:b63272569b8f81c9f49fb4",
  measurementId: "G-14JPDKMLP5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('form.needs-validation');

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('yourName').value;
    const email = document.getElementById('yourEmail').value;
    const password = document.getElementById('yourPassword').value;

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Generate account number (for demonstration purposes)
      const accountNumber = Math.floor(100000000 + Math.random() * 900000000).toString();

      // Save additional user details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        accountNumber: accountNumber,
        checkingBalance: 0, // initial balance
        savingsBalance: 0,  // initial balance
        name: name
      });

      // Initialize the transactions subcollection with an empty document
      await setDoc(doc(db, 'users', user.uid, 'transactions', 'initial'), {
        date: new Date().toISOString(),
        account: 'checking',  // or 'savings'
        description: 'Initial balance',
        category: 'Initial',
        amount: '0.00',
        status: 'Completed'
      });

      // Redirect or show success message
      alert('User registered successfully!');
      window.location.href = 'pages-login.html'; // Redirect to login page
    } catch (error) {
      console.error('Error registering new user:', error);
      alert('Error registering user: ' + error.message);
    }
  });
});
