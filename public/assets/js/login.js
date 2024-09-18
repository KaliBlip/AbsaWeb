import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { auth } from './firebase.js';  // Import the initialized auth from your firebase.js

// Handle form submission
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const email = document.getElementById('yourUsername').value;
  const password = document.getElementById('yourPassword').value;

  try {
    // Sign in the user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Redirect to the dashboard or another page upon successful login
    alert('Login successful!');
    window.location.href = 'dashboard.html'; // Update with your dashboard page

  } catch (error) {
    // Handle errors
    console.error('Error during login: ', error);
    alert('Failed to login: ' + error.message);
  }
});
