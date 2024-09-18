import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { auth, db } from './firebase.js'; // Adjust path if necessary

// Initialize Firebase services
const auth = getAuth();
const db = getFirestore();

// Fetch user data
async function fetchUserData() {
    const user = auth.currentUser;
    if (!user) {
        // Handle user not logged in
        window.location.href = 'pages-login.html';
        return;
    }

    // Get user details
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Update HTML with user data
        document.getElementById('account-number-sidebar').textContent = userData.accountNumber;
        document.getElementById('yourUsername').textContent = userData.name;

        document.getElementById('account-number-dropdown').textContent = userData.accountNumber;
        document.getElementById('total-balance').textContent = `$${(userData.checkingBalance + userData.savingsBalance).toFixed(2)}`;
        document.getElementById('checking-balance').textContent = `$${userData.checkingBalance.toFixed(2)}`;
        document.getElementById('savings-balance').textContent = `$${userData.savingsBalance.toFixed(2)}`;
    } else {
        console.log("No such document!");
    }
}

// Fetch recent transactions
async function fetchRecentTransactions() {
    const user = auth.currentUser;
    if (!user) {
        // Handle user not logged in
        window.location.href = 'pages-login.html';
        return;
    }

    const transactionsRef = collection(db, 'users', user.uid, 'transactions');
    const q = query(transactionsRef, orderBy('date', 'desc'), limit(5));
    const querySnapshot = await getDocs(q);

    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(data.date.toDate()).toLocaleDateString()}</td>
            <td class="text-secondary-emphasis fw-bold">${data.account}</td>
            <td>${data.description}</td>
            <td>${data.category}</td>
            <td>${data.amount}</td>
            <td><span class="badge ${data.status === 'Completed' ? 'bg-success' : 'bg-danger'}">${data.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize dashboard
function initDashboard() {
    fetchUserData();
    fetchRecentTransactions();
}

// Run dashboard initialization
initDashboard();
