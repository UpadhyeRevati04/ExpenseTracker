// script.js 
// Get form, expense list, and total amount elements 

let date=document.getElementById("date");
let d=new Date();
let day=d.getDate();
let month=d.getMonth()+1;
let year=d.getFullYear();

let fullDate = `Date : ${day}-${month}-${year}`;
date.innerHTML=fullDate;

let clr=document.getElementById("clrBtn");
function clrAll() { 
	
		// Remove expense from expenses array 
		expenses.splice(0,expenses.length); 

		// Render expenses 
		renderExpenses(); 
	
} 
clr.addEventListener("click",clrAll);


/*window.jsPDF = window.jspdf.jsPDF;
var docPDF = new jsPDF();

function downloadPDF(invoiceNo){

	var elementHTML = document.querySelector(".container");
	docPDF.html(elementHTML, {
		callback: function(docPDF) {
			docPDF.save(invoiceNo+'.pdf');
		},
		x: 15,
		y: 15,
		width: 170,
		windowWidth: 650
	});
}*/        

window.jsPDF = window.jspdf.jsPDF;


function downloadPDF(){
	var docPDF = new jsPDF();
	var elementHTML = document.querySelector(".container");
	docPDF.html(elementHTML, {
		callback: function(docPDF) {
			docPDF.save(`expense${day}-${month}-${year}.pdf`);
		},
		x: 15,
		y: 15,
		width: 170,
		windowWidth: 650
	});
}    


const expenseForm = 
	document.getElementById("expense-form"); 
const expenseList = 
	document.getElementById("expense-list"); 
const totalAmountElement = 
	document.getElementById("total-amount"); 

// Initialize expenses array from localStorage 
let expenses = 
	JSON.parse(localStorage.getItem("expenses")) || []; 

// Function to render expenses in tabular form 
function renderExpenses() { 

	// Clear expense list 
	expenseList.innerHTML = ""; 

	// Initialize total amount 
	let totalAmount = 0; 

	// Loop through expenses array and create table rows 
	for (let i = 0; i < expenses.length; i++) { 
		const expense = expenses[i]; 
		const expenseRow = document.createElement("tr"); 
		expenseRow.innerHTML = ` 
	<td>${expense.name}</td> 
	<td>$${expense.amount}</td> 
	<td class="delete-btn" data-id="${i}">Delete</td> 
	`; 

		if(console.log(expense.name.includes('Income'))===true){
			
			console.log(expense.name);
			console.log("hi");
		}
		
		expenseList.appendChild(expenseRow); 

		// Update total amount 
        
		totalAmount += expense.amount; 

        if(totalAmount>=0){
            totalAmountElement.textContent = 
            totalAmount.toFixed(2); 
    
        }
        else{
            expenses.splice(expenses.length-1, 1);
            alert("Over budget");
            expenseRow.style.textDecorationLine = "line-through";
            //renderExpenses();
    
        }
        
	} 

	// Update total amount display 
    /*if(totalAmount>=0){
        totalAmountElement.textContent = 
		totalAmount.toFixed(2); 

    }
    else{
        expenses.splice(expenses.length-1, 1);
        alert("Over budget");
        expenseRow.style.textDecorationLine = "line-through";
        //renderExpenses();

    }*/
	//totalAmountElement.textContent = 
		//totalAmount.toFixed(2); 

	// Save expenses to localStorage 
	localStorage.setItem("expenses", 
		JSON.stringify(expenses)); 
} 

// Function to add expense 
function addExpense(event) { 
	event.preventDefault(); 

	// Get expense name and amount from form 
	const expenseNameInput = 
		document.getElementById("expense-name"); 
	const expenseAmountInput = 
		document.getElementById("expense-amount"); 
	const expenseName = 
		expenseNameInput.value; 
	const expenseAmount = 
		parseFloat(expenseAmountInput.value); 

	// Clear form inputs 
	expenseNameInput.value = ""; 
	expenseAmountInput.value = ""; 


	// Validate inputs 
	if (expenseName === "" || isNaN(expenseAmount)) { 
		alert("Please enter valid expense details."); 
		return; 
	} 
	

	// Create new expense object 
	const expense = { 
		name: expenseName, 
		amount: expenseAmount, 
	}; 

	// Add expense to expenses array 
	expenses.push(expense); 


	// Render expenses 
	renderExpenses(); 
} 

// Function to delete expense 
function deleteExpense(event) { 
	if (event.target.classList.contains("delete-btn")) { 

		// Get expense index from data-id attribute 
		const expenseIndex = 
			parseInt(event.target.getAttribute("data-id")); 

		// Remove expense from expenses array 
		expenses.splice(expenseIndex, 1); 

		// Render expenses 
		renderExpenses(); 
	} 
} 

// Add event listeners 
expenseForm.addEventListener("submit", addExpense); 
expenseList.addEventListener("click", deleteExpense); 

// Render initial expenses on page load 
renderExpenses();
