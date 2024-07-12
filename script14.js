document.addEventListener('DOMContentLoaded', () => {
    const financialForm = document.getElementById('financialForm');
    const expenseForm = document.getElementById('expenseForm');
    const invoiceForm = document.getElementById('invoiceForm');
    const totalAssets = document.getElementById('totalAssets');
    const totalLiabilities = document.getElementById('totalLiabilities');
    const netWorth = document.getElementById('netWorth');
    const assetList = document.getElementById('assetList');
    const liabilityList = document.getElementById('liabilityList');
    const expenseList = document.getElementById('expenseList');
    const invoiceList = document.getElementById('invoiceList');
    const totalRevenue = document.getElementById('totalRevenue');
    const totalExpenses = document.getElementById('totalExpenses');
    const netProfit = document.getElementById('netProfit');
  
    let assets = 0;
    let liabilities = 0;
    let revenue = 0;
    let expenses = 0;
  
    financialForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const type = document.getElementById('type').value;
      const description = document.getElementById('description').value;
      const amount = parseFloat(document.getElementById('amount').value);
  
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.textContent = `${description}: ${amount} $`;
  
      if (type === 'actif') {
        assets += amount;
        assetList.appendChild(listItem);
      } else {
        liabilities += amount;
        liabilityList.appendChild(listItem);
      }
  
      updateFinancialStatus();
      financialForm.reset();
    });
  
    expenseForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const description = document.getElementById('expenseDescription').value;
      const amount = parseFloat(document.getElementById('expenseAmount').value);
  
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.textContent = `${description}: ${amount} $`;
  
      expenses += amount;
      expenseList.appendChild(listItem);
      updateFinancialResults();
      expenseForm.reset();
    });
  
    invoiceForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const clientName = document.getElementById('clientName').value;
      const invoiceDescription = document.getElementById('invoiceDescription').value;
      const invoiceAmount = parseFloat(document.getElementById('invoiceAmount').value);
  
      const invoiceItem = document.createElement('li');
      invoiceItem.classList.add('list-group-item');
      invoiceItem.textContent = `Client: ${clientName}, Description: ${invoiceDescription}, Montant: ${invoiceAmount} $`;
  
      revenue += invoiceAmount;
      invoiceList.appendChild(invoiceItem);
      updateFinancialResults();
      invoiceForm.reset();
    });
  
    function updateFinancialStatus() {
      totalAssets.textContent = assets.toFixed(2);
      totalLiabilities.textContent = liabilities.toFixed(2);
      netWorth.textContent = (assets - liabilities).toFixed(2);
    }
  
    function updateFinancialResults() {
      totalRevenue.textContent = revenue.toFixed(2);
      totalExpenses.textContent = expenses.toFixed(2);
      netProfit.textContent = (revenue - expenses).toFixed(2);
    }
  });