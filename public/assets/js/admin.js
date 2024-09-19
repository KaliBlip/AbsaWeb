import { getFirestore, doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { auth, db } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchUserForm = document.getElementById('searchUserForm');
  const transactionsTableBody = document.getElementById('transactionsTableBody');
  const transactionForm = document.getElementById('transactionForm');
  const balanceForm = document.getElementById('balanceForm'); // Ensure balanceForm is defined

  let currentUserId;

  if (searchUserForm) {
    searchUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailOrUid = document.getElementById('searchEmail').value;
      
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', emailOrUid)); 
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            currentUserId = doc.id;
            const userData = doc.data();

            document.getElementById('accountNumber').value = userData.accountNumber;
            document.getElementById('checkingBalance').value = userData.checkingBalance;
            document.getElementById('savingsBalance').value = userData.savingsBalance;

            loadTransactions(currentUserId);
            document.getElementById('accountDetailsSection').style.display = 'block'; // Show account details section
          });
        } else {
          console.log('No user found');
          alert('No user found with that email or UID.');
        }
      } catch (error) {
        console.error("Error finding user:", error);
      }
    });
  }

  async function loadTransactions(userId) {
    const transactionsRef = collection(db, 'users', userId, 'transactions');
    const querySnapshot = await getDocs(transactionsRef);
    transactionsTableBody.innerHTML = ''; 

    querySnapshot.forEach((doc) => {
      const transaction = doc.data();
      const amount = parseFloat(transaction.amount);

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

  if (transactionForm) {
    transactionForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const transactionData = {
        date: new Date(document.getElementById('transactionDate').value),
        account: document.getElementById('accountType').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        amount: parseFloat(document.getElementById('amount').value),
        status: document.getElementById('status').value
      };

      if (currentUserId) {
        const transactionsRef = collection(db, 'users', currentUserId, 'transactions');
        await addDoc(transactionsRef, transactionData);
        alert('Transaction added successfully!');
        loadTransactions(currentUserId);
      }
    });
  }

  if (transactionsTableBody) {
    transactionsTableBody.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
        const transactionId = e.target.getAttribute('data-id');
        // Fetch transaction data and populate the modal form (to be implemented)
        console.log('Editing transaction:', transactionId); // Placeholder for edit logic
      }
    });
  }

  if (balanceForm) {
    balanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const updatedAccountNumber = document.getElementById('accountNumber').value;
      const updatedCheckingBalance = parseFloat(document.getElementById('checkingBalance').value);
      const updatedSavingsBalance = parseFloat(document.getElementById('savingsBalance').value);

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
