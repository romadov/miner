document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currency-select');
    const mineClickPositionInput = document.getElementById('mine-click-position');
    const saveBtn = document.getElementById('save-btn');
    const clearBtn = document.getElementById('clear-btn');

    const savedCurrency = localStorage.getItem('currencySymbol');
    const savedMineClickPosition = localStorage.getItem('mineClickPosition');
    if (savedCurrency) {
        currencySelect.value = savedCurrency;
    }
    if (savedMineClickPosition) {
        mineClickPositionInput.value = savedMineClickPosition;
    }

    saveBtn.addEventListener('click', function() {
        const selectedCurrency = currencySelect.value;
        const mineClickPosition = mineClickPositionInput.value;
        localStorage.setItem('currencySymbol', selectedCurrency);
        localStorage.setItem('mineClickPosition', mineClickPosition);
        alert(`Settings saved: Currency symbol - ${selectedCurrency}, Mine click position - ${mineClickPosition}`);
    });

    clearBtn.addEventListener('click', function() {
        localStorage.removeItem('currencySymbol');
        localStorage.removeItem('totalAmount');
        localStorage.removeItem('selectedMines');
        localStorage.removeItem('mineProbability');
        localStorage.removeItem('mineCount');
        localStorage.removeItem('lastBet');
        localStorage.removeItem('mineClickPosition');
        document.querySelector('.currency .symbol').textContent = 'INR';
        document.querySelector('.currency').textContent = '0.00 INR';
        mineClickPositionInput.value = 1;
        alert('Currency symbol, mine click position, and other settings cleared and reset to default.');
    });
});