// import { db } from './firebase.js'; // Adjust path if needed
// import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

// document.addEventListener('DOMContentLoaded', async () => {
//   const accountNumberElem = document.getElementById('account-number');
//   const totalBalanceElem = document.getElementById('total-balance');
//   const checkingBalanceElem = document.getElementById('checking-balance');
//   const savingsBalanceElem = document.getElementById('savings-balance');
  
//   try {
//     // Replace 'your-collection' with the actual name of your collection
//     const querySnapshot = await getDocs(collection(db, "accounts"));
    
//     querySnapshot.forEach((doc) => {
//       const data = doc.data();
//       // Update elements with data
//       accountNumberElem.textContent = data.accountNumber;
//       totalBalanceElem.textContent = data.totalBalance;
//       checkingBalanceElem.textContent = data.checkingBalance;
//       savingsBalanceElem.textContent = data.savingsBalance;
//     });
//   } catch (error) {
//     console.error("Error fetching data: ", error);
//   }
// });


import { auth, db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';

// Function to check if user is authenticated
const checkAuthAndFetchData = async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      const userId = user.uid; // Use user.uid or other identifier

      // Fetch user data from Firestore
      try {
        const userDoc = doc(db, 'users', userId);
        const userSnap = await getDoc(userDoc);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          document.getElementById('account-number-sidebar').textContent = userData.accountNumber;
          document.getElementById('total-balance').textContent = userData.totalBalance;
          document.getElementById('checking-balance').textContent = userData.checkingBalance;
          document.getElementById('savings-balance').textContent = userData.savingsBalance;
          
          // Additional logic to fetch and display recent transactions
          // Example: loadRecentTransactions(userId);
        } else {
          console.log('No such user!');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    } else {
      // User is not signed in
      console.log('No user is signed in.');
      window.location.href = 'login.html'; // Redirect to login page
    }
  });
};

// Call the function on page load
checkAuthAndFetchData();
