// Import necessary Firebase modules from firebase.js
import { auth, db } from './firebase.js'; 
import { doc, getDoc, collection, query, getDocs } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

// Function to load user data
function loadUserData(user) {
  // Get the user's Firestore document based on UID
  const userDocRef = doc(db, "users", user.uid);

  getDoc(userDocRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();

      // Update account number and balances on the dashboard
      document.getElementById("account-number-sidebar").textContent = userData.accountNumber;
      // document.getElementById("yourEmail").textContent = userData.email;
      // document.getElementById("yourName").textContent = userData.name;


      document.getElementById("account-number-dropdown").textContent = userData.accountNumber;
      document.getElementById("checking-balance").textContent = userData.checkingBalance;
      document.getElementById("savings-balance").textContent = userData.savingsBalance;
      document.getElementById("total-balance").textContent = (userData.checkingBalance + userData.savingsBalance).toFixed(2);

      // Load recent transactions
      loadTransactions(user.uid);
    } else {
      console.log("No such user document!");
    }
  }).catch((error) => {
    console.error("Error fetching user document: ", error);
  });
}

// Function to load transactions from the user's transactions subcollection
function loadTransactions(userId) {
  const transactionsRef = collection(db, "users", userId, "transactions");
  const transactionsQuery = query(transactionsRef);  // Adjust the query if needed

  getDocs(transactionsQuery).then((querySnapshot) => {
    const transactionsTableBody = document.querySelector("tbody");
    transactionsTableBody.innerHTML = "";  // Clear the table before adding transactions

    querySnapshot.forEach((doc) => {
      const transaction = doc.data();
      const row = `
        <tr>
          <td>${new Date(transaction.date.seconds * 1000).toLocaleDateString()}</td>
          <td class="text-secondary-emphasis fw-bold">${transaction.account}</td>
          <td>${transaction.description}</td>
          <td>${transaction.category}</td>
          <td>$${parseFloat(transaction.amount).toFixed(2)}</td>
          <td><span class="badge ${transaction.status === 'Completed' ? 'bg-success' : 'bg-danger'}">${transaction.status}</span></td>
        </tr>
      `;
      transactionsTableBody.innerHTML += row;
    });
  }).catch((error) => {
    console.error("Error loading transactions: ", error);
  });
}

// Listen for Firebase Auth state changes to get the logged-in user
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("yourEmail").textContent = user.email;
    document.getElementById("yourUsername").textContent = user.username;

    loadUserData(user);
  } else {
    // Redirect to login if no user is signed in
    window.location.href = "pages-login.html";
  }
});
