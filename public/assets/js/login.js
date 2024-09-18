// Import Firebase modules
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Get references to form elements
const form = document.querySelector('form');
const usernameInput = document.getElementById('yourUsername');
const passwordInput = document.getElementById('yourPassword');

// Add event listener for form submission
form.addEventListener('submit', async function(e) {
  e.preventDefault(); // Prevent the default form submission

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Simple form validation
  if (!username || !password) {
    alert('Please enter your username and password.');
    return;
  }

  try {
    // Sign in with email and password
    // You need to adjust your authentication method if using custom username
    // or fetch user email from Firestore if required
    const userCredential = await signInWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;

    // Notify the user of successful login
    alert('Login successful!');
    // Redirect to dashboard or home page
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed: ' + error.message);
  }
});
