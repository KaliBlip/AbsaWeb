import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { auth, db } from './firebase.js';  // Make sure the path is correct

// Handle form submission
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById('yourName').value;
  const email = document.getElementById('yourEmail').value;
  const username = document.getElementById('yourUsername').value;
  const password = document.getElementById('yourPassword').value;

  try {
    // Create a new user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // After the user is created, store additional user details in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      username: username,
      accountnumber: accountNumber,
      checkingBalance: 0,  // Default balance
      savingsBalance: 0,   // Default balance
      user_image: ''       // Placeholder for now (you can later add profile image upload functionality)
    });

    // Redirect or show success message
    alert('Account created successfully! Redirecting to the login page.');
    window.location.href = 'pages-login.html';

  } catch (error) {
    // Handle errors
    console.error('Error during registration: ', error);
    alert('Failed to create account: ' + error.message);
  }
});
