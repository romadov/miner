document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currency-select');
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn'); // New button

    // Load the saved currency symbol from localStorage
    const savedCurrency = localStorage.getItem('currencySymbol');
    if (savedCurrency) {
        currencySelect.value = savedCurrency;
    }

    // Save the selected currency symbol to localStorage
    saveBtn.addEventListener('click', function() {
        const selectedCurrency = currencySelect.value;
        localStorage.setItem('currencySymbol', selectedCurrency);
        alert(`Settings saved: Currency symbol - ${selectedCurrency}`);
    });

    // Clear the currency symbol and other data from localStorage and reset the fields
    clearBtn.addEventListener('click', function() {
        localStorage.removeItem('currencySymbol');
        localStorage.removeItem('totalAmount'); // Clear totalAmount
        localStorage.removeItem('selectedMines'); // Clear selectedMines
        localStorage.removeItem('mineProbability'); // Clear mineProbability
        localStorage.removeItem('mineCount'); // Clear mineCount
        localStorage.removeItem('lastBet'); // Clear lastBet
        document.querySelector('.currency .symbol').textContent = 'INR'; // Reset to default
        document.querySelector('.currency').textContent = '0.00 INR'; // Reset total amount
        alert('Currency symbol and other settings cleared and reset to default.');
    });
});