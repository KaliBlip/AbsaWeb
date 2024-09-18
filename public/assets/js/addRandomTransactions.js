import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { auth, db } from './firebase.js'; // Adjust path if necessary

// Initialize Firebase services
const auth = getAuth();
const db = getFirestore();

// Function to generate a random transaction
function generateRandomTransaction() {
    const accounts = ['Checking', 'Savings'];
    const categories = ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Salary'];
    const statuses = ['Pending', 'Completed'];

    const randomDate = new Date(new Date() - Math.floor(Math.random() * 10000000000));
    const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomAmount = (Math.random() * 1000).toFixed(2);
    const randomDescription = `Sample transaction ${Math.floor(Math.random() * 1000)}`;

    return {
        date: randomDate,
        account: randomAccount,
        description: randomDescription,
        category: randomCategory,
        amount: `$${randomAmount}`,
        status: randomStatus
    };
}

// Function to add random transactions to Firestore
async function addRandomTransactions() {
    const user = auth.currentUser;
    if (!user) {
        console.error("No user is logged in");
        return;
    }

    const transactionsRef = collection(db, 'users', user.uid, 'transactions');

    for (let i = 0; i < 5; i++) {
        const transaction = generateRandomTransaction();
        try {
            await addDoc(transactionsRef, {
                ...transaction,
                date: new Date(transaction.date).toISOString()
            });
            console.log(`Transaction added: ${JSON.stringify(transaction)}`);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}

// Expose function to global scope
window.addRandomTransactions = addRandomTransactions;
