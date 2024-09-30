document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currency-select');
    const probabilityInput = document.getElementById('probability-input');
    const saveBtn = document.getElementById('save-btn');

    // Load the saved currency symbol and probability from localStorage
    const savedCurrency = localStorage.getItem('currencySymbol');
    const savedProbability = localStorage.getItem('mineProbability');
    if (savedCurrency) {
        currencySelect.value = savedCurrency;
    }
    if (savedProbability) {
        probabilityInput.value = savedProbability;
    }

    // Save the selected currency symbol and probability to localStorage
    saveBtn.addEventListener('click', function() {
        const selectedCurrency = currencySelect.value;
        const selectedProbability = probabilityInput.value;
        localStorage.setItem('currencySymbol', selectedCurrency);
        localStorage.setItem('mineProbability', selectedProbability);
        alert(`Settings saved: Currency symbol - ${selectedCurrency}, Mine probability - ${selectedProbability}`);
    });
});