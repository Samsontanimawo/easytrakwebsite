/*
  EASYTRAK
  Advanced Responsive Expense Tracker

  Sandbox-safe version.
  No localStorage is used.
*/

const $ = id =>
  document.getElementById(id);


/* ===============================
   ELEMENTS
================================ */

const transactionModal = $("transactionModal");
const deleteModal = $("deleteModal");

const openTransactionModal =
  $("openTransactionModal");

const heroAddButton =
  $("heroAddButton");

const transactionPageAddButton =
  $("transactionPageAddButton");

const closeModal =
  $("closeModal");

const transactionForm =
  $("transactionForm");

const transactionType =
  $("transactionType");

const descriptionInput =
  $("descriptionInput");

const amountInput =
  $("amountInput");

const categoryInput =
  $("categoryInput");

const dateInput =
  $("dateInput");

const recurringInput =
  $("recurringInput");

const typeOptions =
  document.querySelectorAll(".type-option");

const recentTransactions =
  $("recentTransactions");

const allTransactions =
  $("allTransactions");

const totalBalance =
  $("totalBalance");

const totalIncome =
  $("totalIncome");

const totalExpenses =
  $("totalExpenses");

const savingsRate =
  $("savingsRate");

const searchInput =
  $("searchInput");

const typeFilter =
  $("typeFilter");

const categoryFilter =
  $("categoryFilter");

const sortFilter =
  $("sortFilter");

const themeButton =
  $("themeButton");

const menuButton =
  $("menuButton");

const mobileCloseSidebar =
  $("mobileCloseSidebar");

const sidebar =
  $("sidebar");

const overlay =
  $("overlay");

const toast =
  $("toast");

const toastMessage =
  $("toastMessage");

const navItems =
  document.querySelectorAll(".nav-item");

const pageSections =
  document.querySelectorAll(".page-section");

const pageTitle =
  $("pageTitle");

const budgetForm =
  $("budgetForm");

const budgetInput =
  $("budgetInput");

const editBudgetButton =
  $("editBudgetButton");

const goalForm =
  $("goalForm");

const viewAllButton =
  $("viewAllButton");

const exportButton =
  $("exportButton");

const modalTitle =
  $("modalTitle");

const modalEyebrow =
  $("modalEyebrow");

const transactionSubmitButton =
  $("transactionSubmitButton");

const cancelDelete =
  $("cancelDelete");

const confirmDelete =
  $("confirmDelete");


/* ===============================
   STATE
================================ */

let editingTransactionId = null;

let transactionToDelete = null;

let monthlyBudget = 3000;

let savingsGoal = {
  name: "Emergency Fund",
  target: 10000,
  saved: 3200
};

let financeChart = null;

let categoryChart = null;

let toastTimer;


/* ===============================
   DATE
================================ */

function getToday() {

  const date = new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function getDateOffset(offset) {

  const date = new Date();

  date.setDate(
    date.getDate() + offset
  );

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/* ===============================
   STARTER DATA
================================ */

let transactions = [

  {
    id: 1,
    description: "Monthly Salary",
    amount: 5200,
    category: "Salary",
    type: "income",
    date: getDateOffset(-8),
    recurring: true
  },

  {
    id: 2,
    description: "Apartment Rent",
    amount: 1450,
    category: "Housing",
    type: "expense",
    date: getDateOffset(-7),
    recurring: true
  },

  {
    id: 3,
    description: "Grocery Shopping",
    amount: 186.45,
    category: "Food",
    type: "expense",
    date: getDateOffset(-4),
    recurring: false
  },

  {
    id: 4,
    description: "Freelance Project",
    amount: 850,
    category: "Business",
    type: "income",
    date: getDateOffset(-3),
    recurring: false
  },

  {
    id: 5,
    description: "Gas Station",
    amount: 68.20,
    category: "Transport",
    type: "expense",
    date: getDateOffset(-2),
    recurring: false
  },

  {
    id: 6,
    description: "Dinner with Friends",
    amount: 92.75,
    category: "Food",
    type: "expense",
    date: getDateOffset(-1),
    recurring: false
  }

];


/* ===============================
   INITIAL FORM VALUES
================================ */

dateInput.value =
  getToday();

budgetInput.value =
  monthlyBudget;

$("goalNameInput").value =
  savingsGoal.name;

$("goalTargetInput").value =
  savingsGoal.target;

$("goalSavedInput").value =
  savingsGoal.saved;


/* ===============================
   FORMAT CURRENCY
================================ */

function formatCurrency(amount) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD"
    }
  ).format(
    Number(amount) || 0
  );

}


/* ===============================
   FORMAT DATE
================================ */

function formatDate(dateString) {

  const date =
    new Date(
      dateString + "T00:00:00"
    );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );

}


/* ===============================
   ESCAPE HTML
================================ */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent =
    String(text);

  return div.innerHTML;

}


/* ===============================
   TOAST
================================ */

function showToast(message) {

  toastMessage.textContent =
    message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(
      () => {
        toast.classList.remove("show");
      },
      2600
    );

}


/* ===============================
   CATEGORY ICON
================================ */

function getCategoryIcon(category) {

  const icons = {

    Food: "fa-utensils",
    Housing: "fa-house",
    Transport: "fa-car",
    Shopping: "fa-bag-shopping",
    Entertainment: "fa-film",
    Health: "fa-heart-pulse",
    Salary: "fa-money-bill-wave",
    Business: "fa-briefcase",
    Education: "fa-graduation-cap",
    Utilities: "fa-bolt",
    Other: "fa-receipt"

  };

  return icons[category] || "fa-receipt";

}


/* ===============================
   TOTALS
================================ */

function calculateTotals() {

  let income = 0;
  let expenses = 0;

  transactions.forEach(
    transaction => {

      const amount =
        Number(transaction.amount) || 0;

      if (
        transaction.type === "income"
      ) {

        income += amount;

      } else {

        expenses += amount;

      }

    }
  );

  const balance =
    income - expenses;

  const rate =
    income > 0
      ? ((income - expenses) / income) * 100
      : 0;

  return {
    income,
    expenses,
    balance,
    rate
  };

}


/* ===============================
   EXPENSE HELPERS
================================ */

function getExpenseTransactions() {

  return transactions.filter(
    transaction =>
      transaction.type === "expense"
  );

}


function getThisMonthExpenses() {

  const now =
    new Date();

  return transactions
    .filter(
      transaction => {

        if (
          transaction.type !== "expense"
        ) {
          return false;
        }

        const date =
          new Date(
            transaction.date +
            "T00:00:00"
          );

        return (
          date.getMonth() ===
            now.getMonth()

          &&

          date.getFullYear() ===
            now.getFullYear()
        );

      }
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

}


function getAverageExpense() {

  const expenses =
    getExpenseTransactions();

  if (!expenses.length) {
    return 0;
  }

  const total =
    expenses.reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );

  return total / expenses.length;

}


function getCategoryTotals() {

  const totals = {};

  getExpenseTransactions()
    .forEach(
      transaction => {

        if (!totals[transaction.category]) {
          totals[transaction.category] = 0;
        }

        totals[transaction.category] +=
          Number(transaction.amount);

      }
    );

  return totals;

}


function getTopCategory() {

  const categoryTotals =
    getCategoryTotals();

  const entries =
    Object.entries(categoryTotals);

  if (!entries.length) {

    return {
      name: "—",
      amount: 0
    };

  }

  entries.sort(
    (a,b) => b[1] - a[1]
  );

  return {
    name: entries[0][0],
    amount: entries[0][1]
  };

}


/* ===============================
   SUMMARY
================================ */

function updateSummary() {

  const totals =
    calculateTotals();

  totalBalance.textContent =
    formatCurrency(totals.balance);

  totalIncome.textContent =
    formatCurrency(totals.income);

  totalExpenses.textContent =
    formatCurrency(totals.expenses);

  savingsRate.textContent =
    Math.max(
      totals.rate,
      0
    ).toFixed(1) + "%";

  $("thisMonthExpense").textContent =
    formatCurrency(
      getThisMonthExpenses()
    );

  $("averageExpense").textContent =
    formatCurrency(
      getAverageExpense()
    );

  $("topCategory").textContent =
    getTopCategory().name;

  $("transactionCount").textContent =
    transactions.length;

  if (totals.balance > 0) {

    $("balanceMessage").textContent =
      "You're staying above water.";

  } else if (totals.balance < 0) {

    $("balanceMessage").textContent =
      "Expenses are higher than income.";

  } else {

    $("balanceMessage").textContent =
      "Your financial snapshot.";

  }

}


/* ===============================
   TRANSACTION HTML
================================ */

function createTransactionHTML(transaction) {

  const sign =
    transaction.type === "income"
      ? "+"
      : "-";

  const amountClass =
    transaction.type === "income"
      ? "income-text"
      : "expense-text";

  const recurringBadge =
    transaction.recurring
      ? `
        <span class="recurring-badge">
          <i class="fa-solid fa-rotate"></i>
          Recurring
        </span>
      `
      : "";

  return `

    <div class="transaction-item">

      <div class="transaction-icon ${transaction.type}">
        <i class="fa-solid ${getCategoryIcon(transaction.category)}"></i>
      </div>

      <div class="transaction-details">

        <h4>
          ${escapeHTML(transaction.description)}
        </h4>

        <span>
          ${escapeHTML(transaction.category)}
          •
          ${formatDate(transaction.date)}
          ${recurringBadge}
        </span>

      </div>

      <div class="transaction-amount">

        <strong class="${amountClass}">
          ${sign}${formatCurrency(transaction.amount)}
        </strong>

        <small>
          ${transaction.type}
        </small>

      </div>

      <div class="transaction-actions">

        <button
          class="action-button edit-button"
          data-action="edit"
          data-id="${transaction.id}"
          title="Edit"
          aria-label="Edit transaction"
        >
          <i class="fa-solid fa-pen"></i>
        </button>

        <button
          class="action-button duplicate-button"
          data-action="duplicate"
          data-id="${transaction.id}"
          title="Duplicate"
          aria-label="Duplicate transaction"
        >
          <i class="fa-solid fa-copy"></i>
        </button>

        <button
          class="action-button delete-button"
          data-action="delete"
          data-id="${transaction.id}"
          title="Delete"
          aria-label="Delete transaction"
        >
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>

    </div>

  `;

}


/* ===============================
   EMPTY STATE
================================ */

function createEmptyState() {

  return `

    <div class="empty-state">

      <i class="fa-solid fa-wallet"></i>

      <h3>No transactions found</h3>

      <p>
        Add a transaction or change your filters.
      </p>

    </div>

  `;

}


/* ===============================
   RENDER
================================ */

function renderTransactions() {

  const sorted =
    [...transactions]
      .sort(
        (a,b) =>
          new Date(b.date) -
          new Date(a.date)
      );

  recentTransactions.innerHTML =
    sorted.length
      ? sorted
          .slice(0,5)
          .map(createTransactionHTML)
          .join("")
      : createEmptyState();

  renderFilteredTransactions();

}


function renderFilteredTransactions() {

  const search =
    searchInput.value
      .toLowerCase()
      .trim();

  const selectedType =
    typeFilter.value;

  const selectedCategory =
    categoryFilter.value;

  const sort =
    sortFilter.value;

  let filtered =
    transactions.filter(
      transaction => {

        const description =
          transaction.description
            .toLowerCase();

        const category =
          transaction.category
            .toLowerCase();

        const matchesSearch =
          description.includes(search)
          ||
          category.includes(search);

        const matchesType =
          selectedType === "all"
          ||
          transaction.type === selectedType;

        const matchesCategory =
          selectedCategory === "all"
          ||
          transaction.category === selectedCategory;

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory
        );

      }
    );

  filtered = [...filtered];

  if (sort === "newest") {

    filtered.sort(
      (a,b) =>
        new Date(b.date) -
        new Date(a.date)
    );

  }

  if (sort === "oldest") {

    filtered.sort(
      (a,b) =>
        new Date(a.date) -
        new Date(b.date)
    );

  }

  if (sort === "highest") {

    filtered.sort(
      (a,b) =>
        Number(b.amount) -
        Number(a.amount)
    );

  }

  if (sort === "lowest") {

    filtered.sort(
      (a,b) =>
        Number(a.amount) -
        Number(b.amount)
    );

  }

  allTransactions.innerHTML =
    filtered.length
      ? filtered
          .map(createTransactionHTML)
          .join("")
      : createEmptyState();

}


/* ===============================
   TYPE SWITCH
================================ */

typeOptions.forEach(
  option => {

    option.addEventListener(
      "click",
      () => {
        setTransactionType(
          option.dataset.type
        );
      }
    );

  }
);


function setTransactionType(type) {

  transactionType.value =
    type;

  typeOptions.forEach(
    option => {

      option.classList.toggle(
        "active",
        option.dataset.type === type
      );

    }
  );

}


/* ===============================
   ADD MODAL
================================ */

function openAddModal() {

  editingTransactionId = null;

  transactionForm.reset();

  dateInput.value =
    getToday();

  setTransactionType("expense");

  modalEyebrow.textContent =
    "NEW ACTIVITY";

  modalTitle.textContent =
    "Add Transaction";

  transactionSubmitButton.innerHTML = `
    <i class="fa-solid fa-plus"></i>
    <span>Add Transaction</span>
  `;

  openModal();

}


function openModal() {

  transactionModal.classList.add("open");

  document.body.style.overflow =
    "hidden";

  setTimeout(
    () => {
      descriptionInput.focus();
    },
    150
  );

}


function closeTransactionModal() {

  transactionModal.classList.remove("open");

  document.body.style.overflow = "";

  editingTransactionId = null;

}


openTransactionModal.addEventListener(
  "click",
  openAddModal
);

heroAddButton.addEventListener(
  "click",
  openAddModal
);

transactionPageAddButton.addEventListener(
  "click",
  openAddModal
);

closeModal.addEventListener(
  "click",
  closeTransactionModal
);

transactionModal.addEventListener(
  "click",
  event => {

    if (
      event.target === transactionModal
    ) {
      closeTransactionModal();
    }

  }
);


/* ===============================
   EDIT
================================ */

function editTransaction(id) {

  const transaction =
    transactions.find(
      item => item.id === id
    );

  if (!transaction) {
    return;
  }

  editingTransactionId = id;

  descriptionInput.value =
    transaction.description;

  amountInput.value =
    transaction.amount;

  categoryInput.value =
    transaction.category;

  dateInput.value =
    transaction.date;

  recurringInput.checked =
    Boolean(transaction.recurring);

  setTransactionType(
    transaction.type
  );

  modalEyebrow.textContent =
    "EDIT ACTIVITY";

  modalTitle.textContent =
    "Edit Transaction";

  transactionSubmitButton.innerHTML = `
    <i class="fa-solid fa-floppy-disk"></i>
    <span>Save Changes</span>
  `;

  openModal();

}


/* ===============================
   ADD / SAVE
================================ */

transactionForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const description =
      descriptionInput.value.trim();

    const amount =
      Number(amountInput.value);

    const date =
      dateInput.value;

    if (!description) {

      showToast(
        "Please enter a description."
      );

      return;
    }

    if (
      !Number.isFinite(amount)
      ||
      amount <= 0
    ) {

      showToast(
        "Please enter a valid amount."
      );

      return;
    }

    if (!date) {

      showToast(
        "Please select a date."
      );

      return;
    }

    /* EDIT */

    if (
      editingTransactionId !== null
    ) {

      const transaction =
        transactions.find(
          item =>
            item.id ===
            editingTransactionId
        );

      if (!transaction) {
        return;
      }

      transaction.description =
        description;

      transaction.amount =
        amount;

      transaction.category =
        categoryInput.value;

      transaction.type =
        transactionType.value;

      transaction.date =
        date;

      transaction.recurring =
        recurringInput.checked;

      closeTransactionModal();

      updateApp();

      showToast(
        "Transaction updated successfully!"
      );

      return;
    }

    /* ADD */

    const newTransaction = {

      id:
        Date.now() +
        Math.floor(
          Math.random() * 1000
        ),

      description,

      amount,

      category:
        categoryInput.value,

      type:
        transactionType.value,

      date,

      recurring:
        recurringInput.checked

    };

    transactions.push(
      newTransaction
    );

    closeTransactionModal();

    updateApp();

    showToast(
      newTransaction.type === "income"
        ? "Income added successfully!"
        : "Expense added successfully!"
    );

  }
);


/* ===============================
   DUPLICATE
================================ */

function duplicateTransaction(id) {

  const original =
    transactions.find(
      item => item.id === id
    );

  if (!original) {
    return;
  }

  const copy = {

    ...original,

    id:
      Date.now() +
      Math.floor(
        Math.random() * 1000
      ),

    description:
      original.description +
      " (Copy)",

    date:
      getToday()

  };

  transactions.push(copy);

  updateApp();

  showToast(
    "Transaction duplicated!"
  );

}


/* ===============================
   DELETE
================================ */

function requestDeleteTransaction(id) {

  const transaction =
    transactions.find(
      item => item.id === id
    );

  if (!transaction) {
    return;
  }

  transactionToDelete = id;

  $("deleteMessage").textContent =
    `Are you sure you want to delete "${transaction.description}"?`;

  deleteModal.classList.add("open");

  document.body.style.overflow =
    "hidden";

}


function closeDeleteModal() {

  deleteModal.classList.remove("open");

  document.body.style.overflow = "";

  transactionToDelete = null;

}


cancelDelete.addEventListener(
  "click",
  closeDeleteModal
);


deleteModal.addEventListener(
  "click",
  event => {

    if (
      event.target === deleteModal
    ) {
      closeDeleteModal();
    }

  }
);


confirmDelete.addEventListener(
  "click",
  () => {

    if (
      transactionToDelete === null
    ) {
      return;
    }

    transactions =
      transactions.filter(
        item =>
          item.id !==
          transactionToDelete
      );

    closeDeleteModal();

    updateApp();

    showToast(
      "Transaction deleted."
    );

  }
);


/* ===============================
   ACTION BUTTONS
================================ */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-action]"
      );

    if (!button) {
      return;
    }

    const id =
      Number(button.dataset.id);

    const action =
      button.dataset.action;

    if (action === "edit") {
      editTransaction(id);
    }

    if (action === "duplicate") {
      duplicateTransaction(id);
    }

    if (action === "delete") {
      requestDeleteTransaction(id);
    }

  }
);


/* ===============================
   BUDGET
================================ */

function updateBudget() {

  const totals =
    calculateTotals();

  const percent =
    monthlyBudget > 0
      ? (
          totals.expenses /
          monthlyBudget
        ) * 100
      : 0;

  const safePercent =
    Math.min(
      Math.max(percent,0),
      100
    );

  const remaining =
    monthlyBudget -
    totals.expenses;

  $("budgetPercent").textContent =
    percent.toFixed(0) + "%";

  $("budgetSpent").textContent =
    formatCurrency(
      totals.expenses
    );

  $("dashboardBudgetRemaining").textContent =
    formatCurrency(
      remaining
    );

  $("budgetPageTotal").textContent =
    formatCurrency(
      monthlyBudget
    );

  $("budgetPageSpent").textContent =
    formatCurrency(
      totals.expenses
    );

  $("budgetRemaining").textContent =
    formatCurrency(
      remaining
    );

  const degrees =
    (safePercent / 100) * 360;

  $("budgetRing").style.background =
    `conic-gradient(
      var(--primary) ${degrees}deg,
      var(--surface-2) ${degrees}deg
    )`;

  $("budgetProgressBar").style.width =
    safePercent + "%";

  const message =
    $("budgetMessage");

  if (percent < 50) {

    message.textContent =
      "Excellent! Your spending is under control.";

    message.style.color =
      "var(--green)";

  } else if (percent < 75) {

    message.textContent =
      "Looking good. Keep tracking your spending.";

    message.style.color =
      "var(--green)";

  } else if (percent < 90) {

    message.textContent =
      "You've used over 75% of your budget.";

    message.style.color =
      "var(--orange)";

  } else if (percent <= 100) {

    message.textContent =
      "Warning: you're very close to your limit.";

    message.style.color =
      "var(--red)";

  } else {

    message.textContent =
      "Budget exceeded. Review your spending.";

    message.style.color =
      "var(--red)";
  }

}


budgetForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const newBudget =
      Number(budgetInput.value);

    if (
      !Number.isFinite(newBudget)
      ||
      newBudget <= 0
    ) {

      showToast(
        "Please enter a valid budget."
      );

      return;
    }

    monthlyBudget =
      newBudget;

    updateBudget();

    showToast(
      "Monthly budget updated!"
    );

  }
);


editBudgetButton.addEventListener(
  "click",
  () => {

    switchSection("budget");

    setTimeout(
      () => {

        budgetInput.focus();
        budgetInput.select();

      },
      200
    );

  }
);


/* ===============================
   SAVINGS GOAL
================================ */

function updateGoalDisplay() {

  const percentage =
    savingsGoal.target > 0
      ? (
          savingsGoal.saved /
          savingsGoal.target
        ) * 100
      : 0;

  $("goalDisplayName").textContent =
    savingsGoal.name;

  $("goalSavedDisplay").textContent =
    formatCurrency(
      savingsGoal.saved
    );

  $("goalTargetDisplay").textContent =
    formatCurrency(
      savingsGoal.target
    );

  $("goalProgressBar").style.width =
    Math.min(
      Math.max(percentage,0),
      100
    ) + "%";

  if (percentage >= 100) {

    $("goalPercentText").textContent =
      "🎉 Goal completed! Amazing work!";

  } else {

    $("goalPercentText").textContent =
      percentage.toFixed(1) +
      "% completed";

  }

}


goalForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const name =
      $("goalNameInput")
        .value
        .trim();

    const target =
      Number(
        $("goalTargetInput").value
      );

    const saved =
      Number(
        $("goalSavedInput").value
      );

    if (!name) {

      showToast(
        "Please enter a goal name."
      );

      return;
    }

    if (
      !Number.isFinite(target)
      ||
      target <= 0
    ) {

      showToast(
        "Please enter a valid target."
      );

      return;
    }

    if (
      !Number.isFinite(saved)
      ||
      saved < 0
    ) {

      showToast(
        "Please enter a valid saved amount."
      );

      return;
    }

    savingsGoal = {
      name,
      target,
      saved
    };

    updateGoalDisplay();

    showToast(
      "Savings goal updated!"
    );

  }
);


/* ===============================
   CHART COLOR
================================ */

function getChartTextColor() {

  return document.body
    .classList.contains("dark")
      ? "#94a3b8"
      : "#718096";

}


/* ===============================
   FINANCE CHART
================================ */

function updateFinanceChart() {

  if (
    typeof Chart === "undefined"
  ) {
    return;
  }

  const totals =
    calculateTotals();

  const canvas =
    $("financeChart");

  if (financeChart) {
    financeChart.destroy();
  }

  financeChart =
    new Chart(
      canvas,
      {

        type: "bar",

        data: {

          labels: [
            "Income",
            "Expenses",
            "Balance"
          ],

          datasets: [
            {

              label: "Amount",

              data: [
                totals.income,
                totals.expenses,
                Math.max(
                  totals.balance,
                  0
                )
              ],

              backgroundColor: [
                "rgba(19,185,129,.75)",
                "rgba(239,71,111,.75)",
                "rgba(101,88,245,.75)"
              ],

              borderRadius: 12,

              borderSkipped: false

            }
          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          animation: {
            duration: 900,
            easing: "easeOutQuart"
          },

          plugins: {

            legend: {
              display: false
            },

            tooltip: {

              callbacks: {

                label(context) {

                  return formatCurrency(
                    context.raw
                  );

                }

              }

            }

          },

          scales: {

            x: {

              grid: {
                display: false
              },

              ticks: {
                color:
                  getChartTextColor()
              }

            },

            y: {

              beginAtZero: true,

              grid: {
                color:
                  "rgba(148,163,184,.12)"
              },

              ticks: {

                color:
                  getChartTextColor(),

                callback(value) {

                  if (
                    window.innerWidth <= 500
                    &&
                    value >= 1000
                  ) {

                    return (
                      "$" +
                      (value / 1000)
                        .toFixed(1) +
                      "k"
                    );

                  }

                  return "$" + value;

                }

              }

            }

          }

        }

      }
    );

}


/* ===============================
   CATEGORY CHART
================================ */

function updateCategoryChart() {

  if (
    typeof Chart === "undefined"
  ) {
    return;
  }

  const totals =
    getCategoryTotals();

  let labels =
    Object.keys(totals);

  let values =
    Object.values(totals);

  if (!labels.length) {

    labels = ["No Expenses"];
    values = [1];

  }

  const canvas =
    $("categoryChart");

  if (categoryChart) {
    categoryChart.destroy();
  }

  categoryChart =
    new Chart(
      canvas,
      {

        type: "doughnut",

        data: {

          labels,

          datasets: [
            {

              data: values,

              backgroundColor: [
                "#6558f5",
                "#10b981",
                "#ef476f",
                "#f59e0b",
                "#3b82f6",
                "#ec4899",
                "#14b8a6",
                "#8b5cf6",
                "#84cc16"
              ],

              borderWidth: 0,

              hoverOffset: 10

            }
          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          cutout: "68%",

          plugins: {

            legend: {

              position: "bottom",

              labels: {

                usePointStyle: true,

                padding: 15,

                color:
                  getChartTextColor(),

                boxWidth: 10,

                font: {
                  size:
                    window.innerWidth <= 500
                      ? 9
                      : 11
                }

              }

            },

            tooltip: {

              callbacks: {

                label(context) {

                  if (
                    labels[0] ===
                    "No Expenses"
                  ) {
                    return "No expense data";
                  }

                  return (
                    context.label +
                    ": " +
                    formatCurrency(
                      context.raw
                    )
                  );

                }

              }

            }

          }

        }

      }
    );

}


/* ===============================
   INSIGHTS
================================ */

function updateInsights() {

  const totals =
    calculateTotals();

  const top =
    getTopCategory();

  const average =
    getAverageExpense();

  const remaining =
    monthlyBudget -
    totals.expenses;

  let savingsMessage;

  if (totals.income === 0) {

    savingsMessage =
      "Add income transactions to calculate your savings performance.";

  } else if (totals.rate >= 20) {

    savingsMessage =
      `You're keeping ${Math.max(
        totals.rate,
        0
      ).toFixed(1)}% of your income. That's a strong savings rate.`;

  } else {

    savingsMessage =
      `You're currently keeping ${Math.max(
        totals.rate,
        0
      ).toFixed(1)}% of your income. Try working toward 20%.`;

  }

  $("insightCards").innerHTML = `

    <div class="insight-card">

      <div class="insight-icon">
        <i class="fa-solid fa-crown"></i>
      </div>

      <div>
        <strong>Top Spending Category</strong>

        <p>
          ${
            top.name === "—"
              ? "Add expenses to discover your top category."
              : `${escapeHTML(top.name)} is your largest expense category at ${formatCurrency(top.amount)}.`
          }
        </p>
      </div>

    </div>

    <div class="insight-card">

      <div class="insight-icon">
        <i class="fa-solid fa-receipt"></i>
      </div>

      <div>
        <strong>Average Expense</strong>

        <p>
          Your average expense transaction is
          ${formatCurrency(average)}.
        </p>
      </div>

    </div>

    <div class="insight-card">

      <div class="insight-icon">
        <i class="fa-solid fa-wallet"></i>
      </div>

      <div>
        <strong>Budget Position</strong>

        <p>
          ${
            remaining >= 0
              ? `You have ${formatCurrency(remaining)} remaining in your current budget.`
              : `You are ${formatCurrency(Math.abs(remaining))} over your current budget.`
          }
        </p>
      </div>

    </div>

    <div class="insight-card">

      <div class="insight-icon">
        <i class="fa-solid fa-piggy-bank"></i>
      </div>

      <div>
        <strong>Savings Performance</strong>
        <p>${savingsMessage}</p>
      </div>

    </div>

  `;

}


/* ===============================
   SMART TIP
================================ */

function updateSmartTip() {

  const totals =
    calculateTotals();

  const smartTip =
    $("smartTip");

  if (totals.income === 0) {

    smartTip.textContent =
      "Add income to get a clearer picture of your finances.";

  } else if (
    totals.expenses >
    totals.income * .8
  ) {

    smartTip.textContent =
      "Your expenses are above 80% of your income. Look for areas to reduce spending.";

  } else if (
    totals.rate >= 20
  ) {

    smartTip.textContent =
      "Great work! You're saving at least 20% of your income.";

  } else {

    smartTip.textContent =
      "Try saving at least 20% of every income payment.";

  }

}


/* ===============================
   NAVIGATION
================================ */

navItems.forEach(
  item => {

    item.addEventListener(
      "click",
      () => {

        switchSection(
          item.dataset.section
        );

      }
    );

  }
);


function switchSection(section) {

  navItems.forEach(
    item => {

      item.classList.toggle(
        "active",
        item.dataset.section === section
      );

    }
  );

  pageSections.forEach(
    page => {
      page.classList.remove(
        "active-section"
      );
    }
  );

  const target =
    $(section + "Section");

  if (target) {

    target.classList.add(
      "active-section"
    );

  }

  const titles = {
    dashboard: "Overview",
    transactions: "Transactions",
    budget: "Budget",
    goals: "Savings Goal",
    insights: "Insights"
  };

  pageTitle.textContent =
    titles[section] ||
    "EasyTrak";

  closeSidebar();

  if (section === "insights") {

    setTimeout(
      updateCategoryChart,
      80
    );

  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


viewAllButton.addEventListener(
  "click",
  () => {
    switchSection("transactions");
  }
);


/* ===============================
   FILTER EVENTS
================================ */

searchInput.addEventListener(
  "input",
  renderFilteredTransactions
);

typeFilter.addEventListener(
  "change",
  renderFilteredTransactions
);

categoryFilter.addEventListener(
  "change",
  renderFilteredTransactions
);

sortFilter.addEventListener(
  "change",
  renderFilteredTransactions
);


/* ===============================
   EXPORT CSV
================================ */

function escapeCSV(value) {

  return (
    '"' +
    String(value ?? "")
      .replace(/"/g,'""') +
    '"'
  );

}


exportButton.addEventListener(
  "click",
  () => {

    if (!transactions.length) {

      showToast(
        "There are no transactions to export."
      );

      return;
    }

    const rows = [

      [
        "Description",
        "Amount",
        "Category",
        "Type",
        "Date",
        "Recurring"
      ],

      ...transactions.map(
        transaction => [

          transaction.description,
          transaction.amount,
          transaction.category,
          transaction.type,
          transaction.date,
          transaction.recurring
            ? "Yes"
            : "No"

        ]
      )

    ];

    const csv =
      rows
        .map(
          row =>
            row
              .map(escapeCSV)
              .join(",")
        )
        .join("\n");

    try {

      const blob =
        new Blob(
          [csv],
          {
            type:
              "text/csv;charset=utf-8;"
          }
        );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "easytrak-transactions.csv";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      showToast(
        "CSV export created!"
      );

    } catch (error) {

      console.error(error);

      showToast(
        "CSV download is blocked in this preview."
      );

    }

  }
);


/* ===============================
   DARK MODE
================================ */

themeButton.addEventListener(
  "click",
  () => {

    document.body
      .classList.toggle("dark");

    const darkMode =
      document.body
        .classList.contains("dark");

    themeButton.innerHTML =
      darkMode
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

    updateFinanceChart();

    if (
      $("insightsSection")
        .classList.contains(
          "active-section"
        )
    ) {

      updateCategoryChart();

    }

    showToast(
      darkMode
        ? "Dark mode activated."
        : "Light mode activated."
    );

  }
);


/* ===============================
   MOBILE SIDEBAR
================================ */

function openSidebar() {

  sidebar.classList.add("open");

  overlay.classList.add("show");

  document.body.style.overflow =
    "hidden";

}


function closeSidebar() {

  sidebar.classList.remove("open");

  overlay.classList.remove("show");

  if (
    !transactionModal
      .classList.contains("open")
    &&
    !deleteModal
      .classList.contains("open")
  ) {

    document.body.style.overflow = "";

  }

}


menuButton.addEventListener(
  "click",
  openSidebar
);

mobileCloseSidebar.addEventListener(
  "click",
  closeSidebar
);

overlay.addEventListener(
  "click",
  closeSidebar
);


/* ===============================
   ESCAPE KEY
================================ */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeTransactionModal();

      closeDeleteModal();

      closeSidebar();

    }

  }
);


/* ===============================
   RESPONSIVE CHARTS
================================ */

let resizeTimer;

window.addEventListener(
  "resize",
  () => {

    clearTimeout(resizeTimer);

    resizeTimer =
      setTimeout(
        () => {

          if (
            window.innerWidth > 850
          ) {
            closeSidebar();
          }

          updateFinanceChart();

          if (
            $("insightsSection")
              .classList.contains(
                "active-section"
              )
          ) {

            updateCategoryChart();

          }

        },
        250
      );

  }
);


/* ===============================
   UPDATE APP
================================ */

function updateApp() {

  updateSummary();

  renderTransactions();

  updateBudget();

  updateGoalDisplay();

  updateSmartTip();

  updateInsights();

  updateFinanceChart();

  if (
    $("insightsSection")
      .classList.contains(
        "active-section"
      )
  ) {

    updateCategoryChart();

  }

}


/* ===============================
   START
================================ */

updateApp();