import { getFirestore, doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { auth, db } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchUserForm = document.getElementById('searchUserForm');
  const transactionsTableBody = document.getElementById('transactionsTableBody');
  const transactionForm = document.getElementById('transactionForm');
  const balanceForm = document.getElementById('balanceForm');

  let currentUserId;

  // Ensure all DOM elements are present before adding event listeners
  if (searchUserForm) {
    searchUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailOrUid = document.getElementById('searchEmail').value;
      
      try {
        // Query Firestore to find user by email or UID
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', emailOrUid)); // Search by email
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            currentUserId = doc.id;
            const userData = doc.data();

            // Populate balance form with user data
            document.getElementById('accountNumber').value = userData.accountNumber;
            document.getElementById('checkingBalance').value = userData.checkingBalance;
            document.getElementById('savingsBalance').value = userData.savingsBalance;

            loadTransactions(currentUserId);
          });
        } else {
          console.log('No user found');
        }
      } catch (error) {
        console.error("Error finding user:", error);
      }
    });
  }

  // Load transactions for a user
  async function loadTransactions(userId) {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const querySnapshot = await getDocs(transactionsRef);
    transactionsTableBody.innerHTML = '';  // Clear the table

    querySnapshot.forEach((doc) => {
      const transaction = doc.data();
      const amount = parseFloat(transaction.amount); // Ensure amount is a number

      const row = `
        <tr>
          <td>${new Date(transaction.date.seconds * 1000).toLocaleDateString()}</td>
          <td>${transaction.account}</td>
          <td>${transaction.description}</td>
          <td>${transaction.category}</td>
          <td>$${amount.toFixed(2)}</td>
          <td><span class="badge ${transaction.status === 'Completed' ? 'bg-success' : 'bg-danger'}">${transaction.status}</span></td>
          <td>
            <button class="btn btn-warning btn-sm edit-btn" data-id="${doc.id}">Edit</button>
          </td>
        </tr>
      `;
      transactionsTableBody.innerHTML += row;
    });
  }

  // Add or Edit transaction
  if (transactionForm) {
    transactionForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const transactionData = {
        date: new Date(document.getElementById('transactionDate').value),
        account: document.getElementById('accountType').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        amount: parseFloat(document.getElementById('amount').value), // Ensure amount is a number
        status: document.getElementById('status').value
      };

      if (currentUserId) {
        const transactionsRef = collection(db, 'users', currentUserId, 'transactions');
        await addDoc(transactionsRef, transactionData);
        loadTransactions(currentUserId); // Reload transactions after adding
      }
    });
  }

  // Handle editing transaction (you would set up logic to load data into the form when clicking edit)
  if (transactionsTableBody) {
    transactionsTableBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        const transactionId = e.target.getAttribute('data-id');
        // Logic to populate modal form for editing (left as an exercise)
      }
    });
  }

  // Update user balances
  if (balanceForm) {
    balanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const updatedAccountNumber = document.getElementById('accountNumber').value;
      const updatedCheckingBalance = parseFloat(document.getElementById('checkingBalance').value); // Ensure balance is a number
      const updatedSavingsBalance = parseFloat(document.getElementById('savingsBalance').value); // Ensure balance is a number

      if (currentUserId) {
        const userRef = doc(db, 'users', currentUserId);

        try {
          await updateDoc(userRef, {
            accountNumber: updatedAccountNumber,
            checkingBalance: updatedCheckingBalance,
            savingsBalance: updatedSavingsBalance
          });
          alert('User balance updated successfully!');
        } catch (error) {
          console.error("Error updating user balance:", error);
        }
      }
    });
  }
});
