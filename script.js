document.addEventListener('DOMContentLoaded', function() {
    const gameContainer = document.getElementById('game-container');

    // Simulate loading numbers (replace this with your actual loading logic)
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

    // Retrieve mine click position from localStorage
    const mineClickPosition = parseInt(localStorage.getItem('mineClickPosition')) || 1;
    let clickCount = 0;

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    }

    // Load data from localStorage
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

    // Update UI with loaded data
    currencyDisplay.innerHTML = `${formatCurrency(totalAmount)} <span class="symbol">${currencySymbol}</span>`;
    selectSelected.setAttribute('data-value', selectedMines);
    selectSelected.innerHTML = `Mines: ${selectedMines} <img src="img/icon-dd-arrow.svg" alt="Down Arrow" class="arrow-icon">`;
    betInput.value = lastBet.toFixed(2);

    betInput.addEventListener('focus', function() {
        keypad.style.display = 'block';
    });

    // Handle keypad button clicks
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

    // Reset the flag when the input field loses focus
    betInput.addEventListener('blur', function() {
        isKeypadInput = false;
    });

    // Restrict input to digits only
    betInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9.]/g, '');
    });

    // Coefficient mapping based on probability
    const coefficients = {
        1: 1.01,
        2: 1.05,
        3: 1.10,
        4: 1.15,
        5: 1.21,
        6: 1.27,
        7: 1.34,
        8: 1.42,
        9: 1.51,
        10: 1.61,
        11: 1.73,
        12: 1.86,
        13: 2.02,
        14: 2.20,
        15: 2.42,
        16: 2.69,
        17: 3.03,
        18: 3.46,
        19: 4.04,
        20: 4.85
    };

    // Set default value on page load
    const defaultValue = selectSelected.getAttribute('data-value');
    nextBtn.innerHTML = `Next: ${coefficients[defaultValue].toFixed(2)}x`;

    // Create a div element for displaying the cashout amount
    const cashoutDisplay = document.createElement('div');
    cashoutDisplay.id = 'cashout-display';
    cashoutDisplay.style.color = '#fff';
    currencyDisplay.parentNode.insertBefore(cashoutDisplay, currencyDisplay);

    // Toggle dropdown visibility
    selectSelected.addEventListener('click', function() {
        selectItems.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
    });

    // Handle item selection
    selectItems.querySelectorAll('div').forEach(function(item) {
        item.addEventListener('click', function() {
            const value = this.getAttribute('data-value');

            // Update the selected value and display
            selectSelected.setAttribute('data-value', value);
            selectSelected.innerHTML = `Mines: ${value} <img src="img/icon-dd-arrow.svg" alt="Down Arrow" class="arrow-icon">`;
            nextBtn.innerHTML = `Next: ${coefficients[value].toFixed(2)}x`;

            // Hide the dropdown
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');

            // Save selected mines to localStorage
            localStorage.setItem('selectedMines', value);
        });
    });

    // Close the dropdown if clicked outside
    document.addEventListener('click', function(event) {
        if (!selectSelected.contains(event.target) && !selectItems.contains(event.target)) {
            selectItems.classList.add('select-hide');
            selectSelected.classList.remove('select-arrow-active');
        }
    });

    // Disable cell clicks initially
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.pointerEvents = 'none');

    // Add event listener to the Bet button
    betBtn.addEventListener('click', function() {
        const mineCount = parseInt(selectSelected.getAttribute('data-value'));
        const totalCells = cells.length;
        const mineIndices = new Set();

        // Clear previous mines and set all cells to dark-field.png
        cells.forEach(cell => {
            cell.classList.remove('mines');
            cell.classList.remove('flipped');
            cell.classList.remove('animate');
            cell.style.backgroundImage = "url('img/dark-field.png')";
            cell.style.pointerEvents = 'auto';
        });

        // Randomly select cells to add the mines class
        while (mineIndices.size < mineCount) {
            const randomIndex = Math.floor(Math.random() * totalCells);
            mineIndices.add(randomIndex);
        }

        // Store mine indices in localStorage
        localStorage.setItem('mineIndices', JSON.stringify([...mineIndices]));

        // Disable bet input and mine selection
        betInput.disabled = true;
        dropdownBtn.disabled = true;
        minusBtn.disabled = true;
        plusBtn.disabled = true;
        selectSelected.style.pointerEvents = 'none';

        // Add disabled class to visually indicate the elements are disabled
        betInput.classList.add('disabled');
        dropdownBtn.classList.add('disabled');
        minusBtn.classList.add('disabled');
        plusBtn.classList.add('disabled');
        selectSelected.classList.add('disabled');

        // Hide BET button and show CASH OUT button
        betBtn.style.display = 'none';
        cashoutBtn.style.display = 'flex';

        // Deduct the bet amount from the total amount
        currentBet = parseFloat(betInput.value);
        totalAmount -= currentBet;
        localStorage.setItem('totalAmount', totalAmount.toFixed(2));
        currencyDisplay.innerHTML = `${formatCurrency(totalAmount)} <span class="symbol">${currencySymbol}</span>`;

        // Set initial cashout amount to 0.00
        cashoutAmount.textContent = `0.00 ${currencySymbol}`;

        // Save last bet to localStorage
        localStorage.setItem('lastBet', currentBet);

        // Reset the first click flag
        isFirstClick = true;
        clickCount = 0;
    });

    // Add click event listener to each cell
    cells.forEach(function(cell, index) {
        cell.addEventListener('click', function() {
            clickCount++;

            this.classList.add('flipped');

            // Remove opacity class from cashout button
            cashoutBtn.classList.remove('opacity-50');

            // Update progress bar
            progress = Math.min(progress + 4, 100);
            progressBar.style.width = `${progress}%`;
            progressBar.style.backgroundColor = '#28a745';

            // Retrieve mine indices from localStorage
            let mineIndices = JSON.parse(localStorage.getItem('mineIndices'));

            // Place mine on the specified click if not already placed
            if (clickCount === mineClickPosition && !mineIndices.includes(index)) {
                mineIndices.push(index);
                localStorage.setItem('mineIndices', JSON.stringify(mineIndices));
            }

            if (mineIndices.includes(index)) {
                this.classList.add('mines');
                this.style.backgroundImage = "url('img/bomb.png')";

                cells.forEach(cell => {
                    cell.style.pointerEvents = 'none';
                    cell.classList.add('animate');
                });

                revealAllCells();

                setTimeout(function() {
                    location.reload();
                }, 3000);
            } else {
                this.style.backgroundImage = "url('img/star.png')";

                if (isFirstClick) {
                    isFirstClick = false;
                    currentCoefficient = coefficients[selectedMines];
                } else {
                    currentCoefficient *= coefficients[selectedMines];
                }

                cashoutAmount.textContent = `${(currentBet * currentCoefficient).toFixed(2)} ${currencySymbol}`;
                nextBtn.innerHTML = `Next: ${currentCoefficient.toFixed(2)}x`;
            }
        });
    });

    function revealAllCells() {
        const mineIndices = JSON.parse(localStorage.getItem('mineIndices'));
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

    cashoutBtn.addEventListener('click', function() {
        const cashoutValue = parseFloat(cashoutAmount.textContent);
        totalAmount += cashoutValue;
        localStorage.setItem('totalAmount', totalAmount.toFixed(2));

        cashoutDisplay.textContent = `+ ${cashoutValue.toFixed(2)} ${currencySymbol}`;
        cashoutDisplay.style.display = 'block';

        revealAllCells();

        setTimeout(function() {
            location.reload();
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