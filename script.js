const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    } else {
        const singleTransaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value,
        };

        transactions.push(singleTransaction);

        addTransactionDOM(singleTransaction);

        updateValues();

        updateLocalStorage();
        
        // Clear fields
        text.value = '';
        amount.value = '';
    }
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(singleTransaction) {
    // Get sign
    const sign = singleTransaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    // Add class based on value
    item.classList.add(singleTransaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${singleTransaction.text} <span>${sign}${Math.abs(singleTransaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${singleTransaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
    const amounts = transactions
        .map(singleTransaction => singleTransaction.amount);

    const total = amounts
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    
    const expense = (
        amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `$${total}`;
    moneyPlus.innerText = `$${income}`;
    moneyMinus.innerText = `$${expense}`;
}

// Remove transaction by ID {
function removeTransaction(id) {
    transactions = transactions.filter(singleTransaction => singleTransaction.id !== id);

    updateLocalStorage();

    init();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener('submit', addTransaction);