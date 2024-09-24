// currency-settings.js

document.getElementById('save-btn').addEventListener('click', function() {
    const selectedCurrency = document.getElementById('currency-select').value;
    localStorage.setItem('currencySymbol', selectedCurrency);
    alert('Currency symbol saved!');
});