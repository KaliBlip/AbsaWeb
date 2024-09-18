// Import Firebase modules
import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Get references to form elements
const form = document.querySelector('form');
const nameInput = document.getElementById('yourName');
const emailInput = document.getElementById('yourEmail');
const usernameInput = document.getElementById('yourUsername');
const passwordInput = document.getElementById('yourPassword');

// Add event listener for form submission
form.addEventListener('submit', async function(e) {
  e.preventDefault(); // Prevent the default form submission

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  // Simple form validation
  if (!name || !email || !username || !password) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      username: username,
      createdAt: serverTimestamp()
    });

    // Notify the user of successful registration
    // alert('Registration successful! You can now log in.');
    // Redirect to login page or dashboard
    window.location.href = 'pages-login.html';
  } catch (error) {
    console.error('Error:', error);
    alert('Registration failed: ' + error.message);
  }
});
