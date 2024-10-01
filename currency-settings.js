document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currency-select');
    const saveBtn = document.getElementById('save-btn');

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
});