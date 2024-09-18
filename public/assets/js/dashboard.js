import { db } from './firebase.js'; // Adjust path if needed
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
  const accountNumberElem = document.getElementById('account-number');
  const totalBalanceElem = document.getElementById('total-balance');
  const checkingBalanceElem = document.getElementById('checking-balance');
  const savingsBalanceElem = document.getElementById('savings-balance');
  
  try {
    // Replace 'your-collection' with the actual name of your collection
    const querySnapshot = await getDocs(collection(db, "accounts"));
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Update elements with data
      accountNumberElem.textContent = data.accountNumber;
      totalBalanceElem.textContent = data.totalBalance;
      checkingBalanceElem.textContent = data.checkingBalance;
      savingsBalanceElem.textContent = data.savingsBalance;
    });
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
});
