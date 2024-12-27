// Display current date
let date = document.getElementById("date");
let d = new Date();
let day = d.getDate().toString().padStart(2, '0');
let month = (d.getMonth() + 1).toString().padStart(2, '0');
let year = d.getFullYear();
let fullDate = `Date : ${day}-${month}-${year}`;
date.innerHTML = fullDate;

// Add Clear All functionality with confirmation dialog
let clr = document.getElementById("clrBtn");
function clrAll() {
    if (confirm("Are you sure you want to clear all expenses?")) {
        // Clear expenses array
        expenses = [];

        // Render expenses
        renderExpenses();
    }
}
clr.addEventListener("click", clrAll);

// Budget limit (example: 500)
const budgetLimit = 500;

// Initialize jsPDF
window.jsPDF = window.jspdf.jsPDF;

function downloadPDF() {
    const docPDF = new jsPDF();
    const elementHTML = document.querySelector(".container");
    docPDF.html(elementHTML, {
        callback: function (docPDF) {
            docPDF.save(`expense_${day}-${month}-${year}.pdf`);
        },
        x: 15,
        y: 15,
        width: 170,
        windowWidth: 650,
    });
}

// Selectors for expense form, list, and total amount
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmountElement = document.getElementById("total-amount");

// Initialize expenses array from localStorage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Function to render expenses in tabular form
function renderExpenses() {
    expenseList.innerHTML = "";
    let totalAmount = 0;
    let totalExpenses = 0; // Only for expenses
    let totalIncome = 0;  // Only for income

    expenses.forEach((expense, i) => {
        const expenseRow = document.createElement("tr");

        const amountDisplay = expense.amount < 0 ? `-${Math.abs(expense.amount).toFixed(2)}` : `+${expense.amount.toFixed(2)}`;
        const amountColor = expense.amount < 0 ? 'red' : 'green'; // Expense in red, income in green

        expenseRow.innerHTML = `
            <td>${expense.name}</td>
            <td style="color: ${amountColor}">₹${amountDisplay}</td>
            <td class="delete-btn" data-id="${i}">Delete</td>
        `;

        expenseList.appendChild(expenseRow);
        totalAmount += expense.amount;

        // Track total expenses and total income separately
        if (expense.amount < 0) {
            totalExpenses += Math.abs(expense.amount); // Sum of all expenses
        } else {
            totalIncome += expense.amount; // Sum of all incomes
        }
    });

    // Update total amount display
    if (totalAmount === 0) {
        totalAmountElement.textContent = "0.00";
        totalAmountElement.style.color = "black"; // Default color
    } else {
        totalAmountElement.textContent = `${totalAmount.toFixed(2)}`;

        // Highlight total amount if over budget (only for expenses)
        if (totalExpenses > budgetLimit) {
            totalAmountElement.style.color = "red"; // If total expenses exceed budget
        } else {
            totalAmountElement.style.color = "black"; // If within budget
        }
    }

    // Save to localStorage
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Add expense
function addExpense(event) {
    event.preventDefault();

    // Get inputs
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseTypeInput = document.getElementById("expense-type");

    const expenseName = expenseNameInput.value.trim();
    const expenseAmount = parseFloat(expenseAmountInput.value);
    const expenseType = expenseTypeInput.value; // "expense" or "income"

    // Validate inputs
    if (!expenseName || isNaN(expenseAmount) || expenseAmount <= 0) {
        alert("Please enter valid details.");
        return;
    }

    // Check if adding expense exceeds budget (only for expenses)
    let totalExpenses = expenses.reduce((sum, exp) => exp.amount < 0 ? sum + Math.abs(exp.amount) : sum, 0);
    if (expenseType === "expense" && totalExpenses + expenseAmount > budgetLimit) {
        alert("Adding this expense exceeds your budget limit!");
        return;
    }

    // Adjust amount for income or expense
    const adjustedAmount = expenseType === "income" ? expenseAmount : -expenseAmount;

    // Add to expenses array
    expenses.push({ name: expenseName, amount: adjustedAmount });

    // Clear form inputs
    expenseNameInput.value = "";
    expenseAmountInput.value = "";
    expenseTypeInput.value = "expense";

    // Render updated expenses
    renderExpenses();
}

// Function to delete expense
function deleteExpense(event) {
    if (event.target.classList.contains("delete-btn")) {
        // Get expense index from data-id attribute
        const expenseIndex = parseInt(event.target.getAttribute("data-id"));

        // Remove expense from array
        expenses.splice(expenseIndex, 1);

        // Render updated expenses
        renderExpenses();
    }
}

// Add event listeners
expenseForm.addEventListener("submit", addExpense);
expenseList.addEventListener("click", deleteExpense);

// Render initial expenses on page load
renderExpenses();
