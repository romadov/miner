document.addEventListener('DOMContentLoaded', function() {
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
    let progress = 0;
    const keypad = document.getElementById('keypad');
    const applyBtn = document.querySelector('.keypad-btn.apply-btn');
    let currentBet = parseFloat(betInput.value);
    let currentCoefficient = 1.1;
    let isFirstClick = true; // Flag to check if it's the first cell click

    // Load data from localStorage
    let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 3000.00;
    let selectedMines = localStorage.getItem('selectedMines') || '3';
    let lastBet = parseFloat(localStorage.getItem('lastBet')) || 0.30;
    const currencySymbol = localStorage.getItem('currencySymbol') || 'USD';

    // Update UI with loaded data
    currencyDisplay.innerHTML = `${totalAmount.toFixed(2)} <span class="symbol">${currencySymbol}</span>`;
    selectSelected.setAttribute('data-value', selectedMines);
    selectSelected.innerHTML = `mines: ${selectedMines} <img src="img/icon-dd-arrow.svg" alt="Down Arrow" class="arrow-icon">`;
    betInput.value = lastBet.toFixed(2);

    betInput.addEventListener('focus', function() {
        keypad.style.display = 'block';
    });

    // Handle keypad button clicks
    document.querySelectorAll('.keypad-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            if (this.classList.contains('apply-btn')) {
                // Apply button clicked, hide keypad
                keypad.style.display = 'none';
            } else if (this.classList.contains('delete-btn')) {
                // Delete button clicked, remove last character
                betInput.value = betInput.value.slice(0, -1);
            } else {
                // Append clicked button value to bet input
                betInput.value += this.textContent;
            }
        });
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
    nextBtn.innerHTML = `Next: ${coefficients[defaultValue]}x`;

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
            selectSelected.innerHTML = `mines: ${value} <img src="img/icon-dd-arrow.svg" alt="Down Arrow" class="arrow-icon">`;
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
            cell.classList.remove('animate'); // Remove animation class
            cell.style.backgroundImage = "url('img/dark-field.png')";
            cell.style.pointerEvents = 'auto'; // Enable clicking on cells
        });

        // Randomly select cells to add the mines class
        while (mineIndices.size < mineCount) {
            const randomIndex = Math.floor(Math.random() * totalCells);
            mineIndices.add(randomIndex);
        }

        // Add the mines class to the selected cells
        mineIndices.forEach(index => {
            cells[index].classList.add('mines');
        });

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

        // Set initial cashout amount to 0.00
        cashoutAmount.textContent = `0.00 ${currencySymbol}`;

        // Save last bet to localStorage
        localStorage.setItem('lastBet', currentBet);

        // Reset the first click flag
        isFirstClick = true;
    });

    // Add click event listener to each cell
    cells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            this.classList.add('flipped'); // Add the flipped class

            // Update progress bar
            progress = Math.min(progress + 4, 100);
            progressBar.style.width = `${progress}%`;
            progressBar.style.backgroundColor = '#28a745';

            if (this.classList.contains('mines')) {
                // If the cell contains a mine, set background to bomb.png and stop the game
                this.style.backgroundImage = "url('img/bomb.png')";

                // Deduct the bet amount from the total amount
                totalAmount -= currentBet;
                localStorage.setItem('totalAmount', totalAmount.toFixed(2));
                currencyDisplay.innerHTML = `${totalAmount.toFixed(2)} <span class="symbol">${currencySymbol}</span>`;

                // Disable further clicks on cells and add animation class
                cells.forEach(cell => {
                    cell.style.pointerEvents = 'none';
                    cell.classList.add('animate'); // Add animation class
                    if (!cell.classList.contains('flipped')) {
                        cell.classList.add('flipped'); // Add flipped class to all cells
                        if (cell.classList.contains('mines')) {
                            cell.style.backgroundImage = "url('img/opened-bomb.png')";
                        } else {
                            cell.style.backgroundImage = "url('img/opened-star.png')";
                        }
                    }
                });
                // Reload the page after 3 seconds
                setTimeout(function() {
                    location.reload();
                }, 3000);
            } else {
                // If the cell does not contain a mine, set background to star.png
                this.style.backgroundImage = "url('img/star.png')";

                // Start calculating the cashout amount on the first click
                if (isFirstClick) {
                    currentCoefficient = 1.1; // Reset the coefficient
                    isFirstClick = false;
                } else {
                    currentCoefficient *= 1.15; // Increase the coefficient by 15%
                }

                // Update the cashout amount
                cashoutAmount.textContent = `${(currentBet * currentCoefficient).toFixed(2)} ${currencySymbol}`;
                nextBtn.innerHTML = `Next: ${currentCoefficient.toFixed(2)}x`; // Update the Next button
            }
        });
    });

    // Function to reveal all cells
    function revealAllCells() {
        cells.forEach(cell => {
            if (!cell.classList.contains('flipped')) {
                cell.style.pointerEvents = 'none'; // Disable further clicks
                cell.classList.add('flipped'); // Add flipped class to all cells
                if (cell.classList.contains('mines')) {
                    cell.style.backgroundImage = "url('img/opened-bomb.png')";
                } else {
                    cell.style.backgroundImage = "url('img/opened-star.png')";
                }
            }
            cell.classList.add('animate'); // Add animation class to all cells
        });
    }

    // Add event listener to the Cash Out button
    cashoutBtn.addEventListener('click', function() {
        const cashoutValue = parseFloat(cashoutAmount.textContent);
        totalAmount += cashoutValue;
        localStorage.setItem('totalAmount', totalAmount.toFixed(2));

        // Update and show the cashout display
        cashoutDisplay.textContent = `+ ${cashoutValue.toFixed(2)} ${currencySymbol}`;
        cashoutDisplay.style.display = 'block';

        // Reveal all cells
        revealAllCells();

        // Reload the page after 2 seconds
        setTimeout(function() {
            location.reload();
        }, 2000);
    });

    // Toggle dropdown visibility
    dropdownBtn.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click event from propagating
        dropdownMenu.classList.toggle('show');
    });

    // Update bet input value when a dropdown item is clicked
    dropdownItems.forEach(function(item) {
        item.addEventListener('click', function() {
            betInput.value = this.textContent;
            dropdownMenu.classList.remove('show');
        });
    });

    // Increment bet input value by 0.10
    plusBtn.addEventListener('click', function() {
        let currentValue = parseFloat(betInput.value);
        currentValue = (currentValue + 0.10).toFixed(2);
        betInput.value = currentValue;
    });

    // Decrement bet input value by 0.10
    minusBtn.addEventListener('click', function() {
        let currentValue = parseFloat(betInput.value);
        currentValue = Math.max(0, (currentValue - 0.10).toFixed(2));
        betInput.value = currentValue;
    });

    // Close the dropdown if clicked outside
    document.addEventListener('click', function(event) {
        if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
});