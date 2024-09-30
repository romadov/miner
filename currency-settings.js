document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currency-select');
    const mineProbabilityInput = document.getElementById('mine-probability');
    const saveBtn = document.getElementById('save-btn');

    // Load the saved currency symbol and mine probability from localStorage
    const savedCurrency = localStorage.getItem('currencySymbol');
    const savedMineProbability = localStorage.getItem('mineProbability');
    if (savedCurrency) {
        currencySelect.value = savedCurrency;
    }
    if (savedMineProbability) {
        mineProbabilityInput.value = savedMineProbability;
    }

    // Save the selected currency symbol and mine probability to localStorage
    saveBtn.addEventListener('click', function() {
        const selectedCurrency = currencySelect.value;
        const selectedMineProbability = mineProbabilityInput.value;
        localStorage.setItem('currencySymbol', selectedCurrency);
        localStorage.setItem('mineProbability', selectedMineProbability);
        alert(`Settings saved: Currency symbol - ${selectedCurrency}, Mine probability - ${selectedMineProbability}%`);
    });
});