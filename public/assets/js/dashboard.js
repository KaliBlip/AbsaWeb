import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { db } from './firebase.js';  // Assuming firebase.js exports your Firestore instance

// Initialize Firebase Auth and Firestore
const auth = getAuth();
const firestore = getFirestore(db);

// Function to load user data
function loadUserData(user) {
  // Get the user's Firestore document based on UID
  const userDocRef = doc(firestore, "users", user.uid);
  
  getDoc(userDocRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      
      // Update account number and balances on the dashboard
      document.getElementById("account-number-sidebar").textContent = userData.accountNumber;
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
  const transactionsRef = collection(firestore, "users", userId, "transactions");
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
          <td>$${transaction.amount.toFixed(2)}</td>
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
    document.getElementById("yourUsername").textContent = user.email;
    loadUserData(user);
  } else {
    // Redirect to login if no user is signed in
    window.location.href = "pages-login.html";
  }
});
