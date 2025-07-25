let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const productCostError = document.getElementById("product-cost-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;


// Function to save the budget amount in local storage
const saveBudgetAmount = (amount) => {
  localStorage.setItem("budgetAmount", amount);
};

// Function to retrieve the budget amount from local storage
const getBudgetAmount = () => {
  return localStorage.getItem("budgetAmount");
};

// Set Budget Functions

totalAmountButton.addEventListener("click", () => {
  tempAmount = totalAmount.value;
  // Bad input
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    // Set budget
    amount.innerHTML = tempAmount;
    balanceValue.innerText = tempAmount - expenditureValue.innerText;
    // Save budget amount
    saveBudgetAmount(tempAmount);
    // Clear input
    totalAmount.value = "";
  }
});

// Load the budget amount from local storage on page load
window.addEventListener("load", () => {
  const savedBudgetAmount = getBudgetAmount();
  if (savedBudgetAmount) {
    tempAmount = savedBudgetAmount;
    amount.innerHTML = savedBudgetAmount;
    balanceValue.innerText = savedBudgetAmount - expenditureValue.innerText;
  }
});

// Set Budget Functions

totalAmountButton.addEventListener("click", () => {
    tempAmount = totalAmount.value;
    // Bad input
    if (tempAmount === "" || tempAmount < 0) {
        errorMessage.classList.remove("hide");
    } else {
        errorMessage.classList.add("hide");
        // Set bidget
        amount.innerHTML = tempAmount;
        balanceValue.innerText = tempAmount - expenditureValue.innerText;
        // Clear input
        totalAmount.value = "";
        calculateRemainingAmount();
    }
});

// Disable edit and delete button function

const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
};

// Modify list elements function

const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = parseFloat(balanceValue.innerText);
  let currentExpense = parseFloat(expenditureValue.innerText);
  let parentAmount = parseFloat(parentDiv.querySelector(".amount").innerText);
  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount.toFixed(2); // Afficher le montant avec 2 décimales
    disableButtons(true);
  }

  if (parentAmount < 0) {
    // Ajouter de l'argent (augmenter la balance)
    balanceValue.innerText = (currentBalance + Math.abs(parentAmount)).toFixed(2); // Afficher le résultat avec 2 décimales
  } else {
    // Diminuer l'argent (diminuer la balance)
    balanceValue.innerText = (currentBalance - parentAmount).toFixed(2); // Afficher le résultat avec 2 décimales
  }

  expenditureValue.innerText = (currentExpense - parentAmount).toFixed(2); // Afficher le résultat avec 2 décimales
  parentDiv.remove();
    // Calculer le montant restant
    calculateRemainingAmount();
};

// Create list function

const listCreator = (expenseName, expenseValue) => {
    let subListContent = document.createElement("div");
    subListContent.classList.add("sublist-content", "flex-space");
    list.appendChild(subListContent);
    subListContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
    let editButton = document.createElement("button");
    editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
    editButton.style.fontSize = "1.2em";
    editButton.addEventListener("click", () => {
        modifyElement(editButton, true);
    });
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
    deleteButton.style.fontSize = "1.2em";
    deleteButton.addEventListener("click", () => {
        modifyElement(deleteButton);
    });
    subListContent.appendChild(editButton);
    subListContent.appendChild(deleteButton);
    document.getElementById("list").appendChild(subListContent);
    calculateRemainingAmount();
};

// Add expenses function

checkAmountButton.addEventListener("click", () => {
  // Vérifiez si le montant est vide
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }
  // Vérifiez si le montant contient le signe "-"
  const expenditure = parseFloat(userAmount.value);
  if (userAmount.value.startsWith("-")) {
    // Diminuer la balance
    const totalBalance = parseFloat(balanceValue.innerText) - Math.abs(expenditure);
    balanceValue.innerText = totalBalance.toFixed(2); // Afficher le résultat avec 2 décimales
  } else {
    // Augmenter la balance
    const totalBalance = parseFloat(balanceValue.innerText) + expenditure;
    balanceValue.innerText = totalBalance.toFixed(2); // Afficher le résultat avec 2 décimales
  }
  // Augmenter le total des dépenses
  const sum = parseFloat(expenditureValue.innerText) + Math.abs(expenditure);
  expenditureValue.innerText = sum.toFixed(2); // Afficher le résultat avec 2 décimales
  // Créer la liste
  listCreator(productTitle.value, userAmount.value);
  // Effacer les inputs
  productTitle.value = "";
  userAmount.value = "";
  // Calculer le montant restant
  calculateRemainingAmount();
});