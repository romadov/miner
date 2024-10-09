document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('game-container');

    setTimeout(function() {
        gameContainer.style.display = 'flex';
    }, 500);

    const selectSelected = document.querySelector('.select-selected');
    const selectItems = document.querySelector('.select-items');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const betInput = document.getElementById('bet-input');
    const minusBtn = document.getElementById('minus-btn');
    const plusBtn = document.getElementById('plus-btn');
    const betBtn = document.getElementById('bet-btn');
    const cashoutBtn = document.getElementById('cashout-btn');
    const cashoutAmount = document.getElementById('cashout-amount');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const currencyDisplay = document.querySelector('.currency');
    const autoGameControl = document.querySelector('.auto-game-control');
    const minesBtn = document.querySelector('.mines-btn');
    let progress = 0;
    const keypad = document.getElementById('keypad');
    let isKeypadInput = false;
    const applyBtn = document.querySelector('.keypad-btn.apply-btn');
    let currentBet = parseFloat(betInput.value);
    let currentCoefficient = 1.1;
    let isFirstClick = true;
    const betLabel = document.getElementById('bet-label');
    let previousValue = betInput.value;

    const mineClickPosition = parseInt(localStorage.getItem('mineClickPosition')) || 1;
    let clickCount = 0;

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    }

    let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 10000.00;
    let selectedMines = localStorage.getItem('selectedMines') || '3';
    let lastBet = parseFloat(localStorage.getItem('lastBet')) || 7.00;
    const currencySymbol = localStorage.getItem('currencySymbol') || 'INR';

    betInput.value = formatCurrency(lastBet);

    betInput.addEventListener('focus', function() {
        previousValue = betInput.value;
        betInput.value = '';
    });

    betInput.addEventListener('blur', function() {
        if (betInput.value === '') {
            betInput.value = previousValue;
        } else {
            betInput.value = formatCurrency(parseFloat(betInput.value));
        }
    });

    document.addEventListener('click', function(event) {
        if (!betInput.contains(event.target) && !keypad.contains(event.target)) {
            keypad.style.display = 'none';
        }
    });

    function getRandomWithProbability(probability) {
        return Math.random() < probability;
    }

    currencyDisplay.innerHTML = `${formatCurrency(totalAmount)} <span class="symbol">${currencySymbol}</span>`;
    selectSelected.setAttribute('data-value', selectedMines);
    selectSelected.innerHTML = `Mines: ${selectedMines} <img src="img/icon-dd-arrow.svg" alt="Down Arrow" class="arrow-icon">`;
    betInput.value = lastBet.toFixed(2);

    betInput.addEventListener('focus', function() {
        keypad.style.display = 'block';
    });

    document.querySelectorAll('.keypad-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            if (this.classList.contains('apply-btn')) {
                keypad.style.display = 'none';
            } else if (this.classList.contains('delete-btn')) {
                betInput.value = betInput.value.slice(0, -1);
            } else {
                betInput.value += this.textContent;
            }
        });
    });

    betInput.addEventListener('blur', function() {
        isKeypadInput = false;
    });

    betInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9.]/g, '');
    });

    const coefficients = {
        1: [1.01, 1.05, 1.10, 1.15, 1.21, 1.27, 1.34, 1.42, 1.51, 1.61, 1.73, 1.86, 2.02, 2.20, 2.42, 2.69, 3.03, 3.46, 4.04, 4.85, 6.06, 8.08, 12.12, 24.25],
        2: [1.05, 1.15, 1.25, 1.38, 1.53, 1.70, 1.90, 2.13, 2.42, 2.77, 3.19, 3.73, 4.40, 5.29, 6.46, 8.08, 10.39, 13.85, 19.40, 29.10, 48.50, 97.00, 291.00],
        3: [1.10, 1.25, 1.44, 1.67, 1.95, 2.30, 2.73, 3.28, 3.98, 4.90, 6.12, 7.80, 10.14, 13.52, 18.59, 26.55, 39.73, 63.74, 111.54, 223.09],
        4: [1.15, 1.38, 1.67, 2.05, 2.53, 3.16, 4.00, 5.15, 6.74, 8.98, 12.25, 17.16, 24.78, 37.18, 58.43, 97.38, 175.29, 350.58, 818.03, 2.454, 10, 12.270, 50, 17.170, 50],
        5: [1.21, 1.53, 1.95, 2.53, 3.32, 4.43, 6.01, 8.32, 11.79, 17.16, 25.74, 40.04, 65.07, 100.29],
        6: [1.27, 1.70, 2.30, 3.16, 4.43, 6.33, 9.25, 13.88],
        7: [1.34, 1.90, 2.73, 4.00, 6.01, 9.25, 14.65, 23.97],
        8: [1.42, 2.13, 3.28, 5.15, 8.32, 13.88, 23.97],
        9: [1.51, 2.42, 3.98, 6.74, 11.79, 21.45, 40.75],
        10: [1.61, 2.77, 4.90, 8.98, 17.16, 34.32],
        11: [1.73, 3.19, 6.12, 12.25, 25.74, 57.20],
        12: [1.86, 3.73, 7.80, 17.16, 40.04, 100.10, 271.72],
        13: [2.02, 4.40, 10.14, 24.78, 65.07, 185.91],
        14: [2.20, 5.29, 13.52, 37.18, 111.55, 371.83],
        15: [2.42, 6.46, 18.59, 58.43, 204.50],
        16: [2.69, 8.08, 26.55, 97.38],
        17: [3.03, 10.39, 39.83, 175.29],
        18: [3.46, 13.85, 63.74, 350.58],
        19: [4.04, 19.40, 111.55, 818.03],
        20: [4.85, 29.10, 223.10, 1628.30],
    };

    function getCoefficient(mines, click) {
        if (coefficients[mines] && coefficients[mines][click - 1]) {
            return coefficients[mines][click - 1];
        }
        return 1.1;
    }

    const defaultValue = selectSelected.getAttribute('data-value');
    nextBtn.innerHTML = `Next: ${getCoefficient(defaultValue, 1).toFixed(2)}x`;

    const cashoutDisplay = document.createElement('div');
    cashoutDisplay.id = 'cashout-display';
    cashoutDisplay.style.color = '#fff';
    currencyDisplay.parentNode.insertBefore(cashoutDisplay, currencyDisplay);

    selectSelected.addEventListener('click', function() {
        selectItems.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
    });

    selectItems.querySelectorAll('div').forEach(function(item) {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');

            selectSelected.setAttribute('data-value', value);
            selectSelected.innerHTML = `Mines: ${value} <img src="img/icon-dd-arrow.svg" alt="Down Arrow" class="arrow-icon">`;
            nextBtn.innerHTML = `Next: ${getCoefficient(value, 1).toFixed(2)}x`;

            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');

            localStorage.setItem('selectedMines', value);
        });
    });

    document.addEventListener('click', function(event) {
        if (!selectSelected.contains(event.target) && !selectItems.contains(event.target)) {
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
        }
    });

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.pointerEvents = 'none');

    betBtn.addEventListener('click', function() {
        cells.forEach(cell => cell.style.pointerEvents = 'auto');

        betInput.disabled = true;
        dropdownBtn.disabled = true;
        minusBtn.disabled = true;
        plusBtn.disabled = true;
        selectSelected.style.pointerEvents = 'none';

        betInput.classList.add('disabled');
        dropdownBtn.classList.add('disabled');
        minusBtn.classList.add('disabled');
        plusBtn.classList.add('disabled');
        selectSelected.classList.add('disabled');

        betBtn.style.display = 'none';
        cashoutBtn.style.display = 'flex';

        currentBet = parseFloat(betInput.value);
        totalAmount -= currentBet;
        localStorage.setItem('totalAmount', totalAmount.toFixed(2));
        currencyDisplay.innerHTML = `${formatCurrency(totalAmount)} <span class="symbol">${currencySymbol}</span>`;

        cashoutAmount.textContent = `0.00 ${currencySymbol}`;

        localStorage.setItem('lastBet', currentBet);

        isFirstClick = true;
        clickCount = 0;

        // Set the initial coefficient based on the selected number of mines
        const selectedMines = parseInt(selectSelected.getAttribute('data-value'));
        currentCoefficient = getCoefficient(selectedMines, 1);
        nextBtn.innerHTML = `Next: ${currentCoefficient.toFixed(2)}x`;

        console.log('mineClickPosition:', mineClickPosition);

        if (mineClickPosition === 100) {
            const mineCount = parseInt(selectSelected.getAttribute('data-value'));
            const totalCells = cells.length;
            let mineIndices = [];

            while (mineIndices.length < mineCount) {
                const randomIndex = Math.floor(Math.random() * totalCells);
                if (!mineIndices.includes(randomIndex)) {
                    mineIndices.push(randomIndex);
                }
            }

            localStorage.setItem('mineIndices', JSON.stringify(mineIndices));
            console.log('Mine indices generated after bet click:', mineIndices);
        }

        // Add the 'open-cell' class to all cells
        cells.forEach(cell => cell.classList.add('open-cell'));
    });

    cells.forEach(function(cell, index) {
        cell.addEventListener('click', function() {
            clickCount++;

            this.classList.add('flipped');

            cashoutBtn.classList.remove('opacity-50');

            progress = Math.min(progress + 4, 100);
            progressBar.style.width = `${progress}%`;
            progressBar.style.backgroundColor = '#28a745';

            let mineIndices = JSON.parse(localStorage.getItem('mineIndices')) || [];

            if (mineClickPosition !== 100 && clickCount === mineClickPosition) {
                const mineCount = parseInt(selectSelected.getAttribute('data-value'));
                const totalCells = cells.length;

                // Ensure the first mine is the clicked cell
                mineIndices = [index];

                while (mineIndices.length < mineCount) {
                    const randomIndex = Math.floor(Math.random() * totalCells);
                    if (!mineIndices.includes(randomIndex) && !cells[randomIndex].classList.contains('flipped')) {
                        mineIndices.push(randomIndex);
                    }
                }

                localStorage.setItem('mineIndices', JSON.stringify(mineIndices));
                console.log('Mine indices generated:', mineIndices);
            }

            if (mineIndices.includes(index)) {
                this.classList.add('mines');
                this.style.backgroundImage = "url('img/bomb.png')";

                cells.forEach(cell => {
                    cell.style.pointerEvents = 'none';
                });

                revealAllCells();

                setTimeout(function() {
                    resetGame();
                }, 2000);
            } else {
                this.style.backgroundImage = "url('img/star.png')";

                if (isFirstClick) {
                    isFirstClick = false;
                }

                currentCoefficient = getCoefficient(parseInt(selectSelected.getAttribute('data-value')), clickCount + 1);
                cashoutAmount.textContent = `${(currentBet * currentCoefficient).toFixed(2)} ${currencySymbol}`;
                nextBtn.innerHTML = `Next: ${currentCoefficient.toFixed(2)}x`;
            }
        });
    });

    function revealAllCells() {
        let mineIndices = JSON.parse(localStorage.getItem('mineIndices')) || [];
        cells.forEach((cell, index) => {
            if (mineIndices.includes(index) && !cell.classList.contains('flipped')) {
                cell.style.pointerEvents = 'none';
                cell.classList.add('flipped');
                cell.style.backgroundImage = "url('img/real_bomb.png')";
                cell.classList.add('animate');
            } else if (!cell.classList.contains('flipped')) {
                cell.style.backgroundImage = "url('img/opened-star.png')";
            }
        });
    }

    function resetGame() {
        clickCount = 0;
        isFirstClick = true;
        currentCoefficient = 1.1;
        progress = 0;

        cells.forEach(cell => {
            cell.classList.remove('flipped', 'mines', 'animate');
            cell.style.backgroundImage = '';
            cell.style.pointerEvents = 'none';
        });

        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#28a745';

        betInput.disabled = false;
        dropdownBtn.disabled = false;
        minusBtn.disabled = false;
        plusBtn.disabled = false;
        selectSelected.style.pointerEvents = 'auto';

        betInput.classList.remove('disabled');
        dropdownBtn.classList.remove('disabled');
        minusBtn.classList.remove('disabled');
        plusBtn.classList.remove('disabled');
        selectSelected.classList.remove('disabled');

        betBtn.style.display = 'flex';
        cashoutBtn.style.display = 'none';

        cashoutAmount.textContent = `0.00 ${currencySymbol}`;
        nextBtn.innerHTML = `Next: ${getCoefficient(selectSelected.getAttribute('data-value'), 1).toFixed(2)}x`;

        localStorage.removeItem('mineIndices');

        currencyDisplay.innerHTML = `${formatCurrency(totalAmount)} <span class="symbol">${currencySymbol}</span>`;

        cashoutDisplay.style.display = 'none';
    }

    cashoutBtn.addEventListener('click', function() {
        const cashoutValue = parseFloat(cashoutAmount.textContent);
        totalAmount += cashoutValue;
        localStorage.setItem('totalAmount', totalAmount.toFixed(2));

        cashoutDisplay.textContent = `+ ${cashoutValue.toFixed(2)} ${currencySymbol}`;
        cashoutDisplay.style.display = 'block';

        // Generate mine indices if not already generated
        let mineIndices = JSON.parse(localStorage.getItem('mineIndices')) || [];
        if (mineIndices.length === 0) {
            const mineCount = parseInt(selectSelected.getAttribute('data-value'));
            const totalCells = cells.length;

            while (mineIndices.length < mineCount) {
                const randomIndex = Math.floor(Math.random() * totalCells);
                if (!mineIndices.includes(randomIndex) && !cells[randomIndex].classList.contains('flipped')) {
                    mineIndices.push(randomIndex);
                }
            }

            localStorage.setItem('mineIndices', JSON.stringify(mineIndices));
            console.log('Mine indices generated during cashout:', mineIndices); // Log the mine indices
        }

        revealAllCells();

        setTimeout(function() {
            resetGame();
        }, 2000);
    });

    dropdownBtn.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    dropdownItems.forEach(function(item) {
        item.addEventListener('click', function() {
            betInput.value = this.textContent;
            dropdownMenu.classList.remove('show');
        });
    });

    plusBtn.addEventListener('click', function() {
        let currentValue = parseFloat(betInput.value);
        currentValue = (currentValue + 0.10).toFixed(2);
        betInput.value = currentValue;
    });

    minusBtn.addEventListener('click', function() {
        let currentValue = parseFloat(betInput.value);
        currentValue = Math.max(0, (currentValue - 0.10).toFixed(2));
        betInput.value = currentValue;
    });

    document.addEventListener('click', function(event) {
        if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});