// Import the necessary Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from './firebase.js'; // Adjust the import based on your export method

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form'); // Select the form element

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const email = loginForm.querySelector('input[name="username"]').value;
    const password = loginForm.querySelector('input[name="password"]').value;

    try {
      // Sign in with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to the dashboard on successful login
      window.location.href = 'dashboard.html';
    } catch (error) {
      // Handle errors here
      console.error('Error signing in:', error.message);
      alert('Login failed. Please check your email and password.');
    }
  });
});
