document.addEventListener('DOMContentLoaded', () => {
    const totalCells = 25;
    let mineIndices = [];
    let selectedMines = 3;
    let clickCount = 0;
    let desiredClickCount = localStorage.getItem('desiredClickCount') || 0;
    desiredClickCount = parseInt(desiredClickCount, 10);
    let minesItemClickCount = 0;
    const inputFields = document.querySelector('.input');
    const numpadButtons = document.querySelectorAll('.numpad-button .button-blue');
    const deleteButton = document.querySelector('.numpad-button img[alt="Image"]');
    const confirmButton = document.querySelector('.numpad-button-accept .button-blue');
    const progressBar = document.querySelector('.progress-bar');
    const btnBet = document.querySelector('.btn-bet');
    const btnRandom = document.querySelector('.button-random');
    const btnCashout = document.querySelector('.btn-cashout');
    const elementsToDisable = document.querySelectorAll('.bet-input-wrapper, .number-of-mines, .game-mode-toggle, .dropdown-game');
    const cells = document.querySelectorAll('.mines-item');
    const inputField = document.querySelector('.input-wrapper .input');
    const cashoutValue = document.querySelector('.btn-control-value');
    const balanceElements = document.querySelectorAll('.balance');
    const footerBalanceElement = document.querySelector('.footer-controls-balance .balance');
    const dropdownToggle = document.querySelector('.dropdown-toggle span');
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

    const savedInputValue = localStorage.getItem('inputFields');
    if (savedInputValue !== null) {
        inputFields.value = savedInputValue;
    }

    // Retrieve saved selected mines value from local storage
    const savedSelectedMines = localStorage.getItem('selectedMines');
    if (savedSelectedMines !== null) {
        selectedMines = parseInt(savedSelectedMines, 10);
        dropdownToggle.textContent = `Mines: ${selectedMines}`;
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.textContent, 10) === selectedMines) {
                item.classList.add('active');
            }
        });
    }

    let savedBalanceValues = localStorage.getItem('balanceElements');
    if (savedBalanceValues) {
        try {
            savedBalanceValues = JSON.parse(savedBalanceValues);
        } catch (e) {
            savedBalanceValues = ["10,000.00"];
        }
    } else {
        savedBalanceValues = ["10,000.00"];
    }
    if (savedBalanceValues !== null) {
        balanceElements.forEach((element, index) => {
            if (savedBalanceValues[index] !== undefined) {
                if (element === footerBalanceElement) {
                    element.innerHTML = `<span>₹</span> ${savedBalanceValues[index]}`;
                } else {
                    element.innerHTML = `${savedBalanceValues[index]} <span>INR</span>`;
                }
            } else {
                if (element === footerBalanceElement) {
                    element.innerHTML = `<span>₹</span> 10,000.00`;
                } else {
                    element.innerHTML = `10,000.00 <span>INR</span>`;
                }
            }
        });
    }

    inputFields.addEventListener('input', () => {
        localStorage.setItem('inputFields', inputFields.value);
    });

    // Save balanceElements values to local storage on change
    function saveBalanceElements() {
        const balanceValues = Array.from(balanceElements).map(element =>
            `₹ ${element.textContent.replace(/ INR/g, '').replace(/ ₹/g, '')}`
        );
        localStorage.setItem('balanceElements', JSON.stringify(balanceValues));
    }

    // Call saveBalanceElements whenever balanceElements are updated
    balanceElements.forEach(element => {
        const observer = new MutationObserver(saveBalanceElements);
        observer.observe(element, { childList: true, subtree: true });
    });

    // Function to format numbers as 1,000.00
    function formatNumber(value) {
        return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Function definitions
    function updateCoefficientDisplay() {
        const nextTileElement = document.querySelector('.next-tile span:nth-child(2)');
        if (nextTileElement && coefficients[selectedMines] && coefficients[selectedMines][clickCount] !== undefined) {
            nextTileElement.textContent = `${coefficients[selectedMines][clickCount].toFixed(2)}x`;
        }
    }

    function resetGame() {
        // Reset game-specific variables
        clickCount = 0;
        minesItemClickCount = 0;
        mineIndices = [];

        // Clear and hide all balance-adding elements
        const balanceAddingElements = document.querySelectorAll('.balance-adding');
        balanceAddingElements.forEach(balanceAddingElement => {
            balanceAddingElement.textContent = '';
            balanceAddingElement.classList.remove('show');
        });

        // Reset UI elements
        document.querySelectorAll('.mines-item').forEach(item => {
            item.classList.remove('mines-item-bomb', 'mines-item-star', 'mines-item-yellow-star', 'mines-item-explosion', 'flip', 'mines-open');
        });

        // Re-enable elements
        elementsToDisable.forEach(element => element.removeAttribute('disabled'));
        btnBet.classList.remove('hidden');
        btnCashout.classList.add('hidden');
        removeOpacity(btnCashout);

        // Update displays
        updateCoefficientDisplay();
        updateProgressBar();
        updateCashoutValue();
        cashoutValue.textContent = '0.00 INR';
    }

    function setOpacity(element) {
        if (element) {
            element.style.opacity = '0.65';
        }
    }

    function removeOpacity(element) {
        element.style.opacity = '';
    }

    function updateProgressBar() {
        const freeCells = totalCells - selectedMines;
        const progressPercentage = (clickCount / freeCells) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    function generateMines(clickedIndex) {
        console.log('Generating Mines with selectedMines:', selectedMines); // Added for debugging
        mineIndices = []; // Clear the array before generating new mines
        const minesItems = document.querySelectorAll('.mines-item'); // Get all mines items

        // Ensure the clicked index is a mine
        if (clickedIndex < totalCells) {
            mineIndices.push(clickedIndex);
        }

        while (mineIndices.length < selectedMines) {
            const randomIndex = Math.floor(Math.random() * totalCells);
            const element = minesItems[randomIndex];

            // Check if the element has the class 'mines-item-yellow-star'
            if (!mineIndices.includes(randomIndex) && !element.classList.contains('mines-item-yellow-star')) {
                mineIndices.push(randomIndex);
            }
        }
        console.log('Generated Mines:', mineIndices); // Added for debugging
    }

    function revealAllCells() {
        cells.forEach((cell, index) => {
            if (!cell.classList.contains('mines-item-yellow-star')) {
                if (mineIndices.includes(index)) {
                    if (!cell.classList.contains('mines-item-explosion')) {
                        cell.classList.add('mines-item-bomb', 'flip');
                        setTimeout(() => {
                            resetGame();
                        }, 2000);
                    }
                } else {
                    cell.classList.add('mines-item-star', 'flip');
                }
            }
        });
    }

    function updateCashoutValue() {
        const currentBet = parseFloat(inputField.value.replace(/,/g, '')) || 0;
        const currentCoefficient = coefficients[selectedMines][clickCount] || 1;
        const newCashoutValue = (currentBet * currentCoefficient).toFixed(2);
        cashoutValue.textContent = `${formatNumber(newCashoutValue)} INR`;
    }

    function updateBalance() {
        const currentBet = parseFloat(inputField.value.replace(/,/g, '')) || 0;
        let currentBalance = parseFloat(balanceElements[0].textContent.replace(/,/g, '')) || 0;
        currentBalance -= currentBet;

        balanceElements.forEach(element => {
            if (element === footerBalanceElement) {
                setTimeout(() => {
                    element.innerHTML = `<span>₹</span> ${formatNumber(currentBalance)}`;
                }, 2000); // 2-second delay for footerBalanceElement
            } else {
                element.innerHTML = `${formatNumber(currentBalance)} <span class="text-white-50 ml-1">INR</span>`;
            }
        });
    }

    function cashOut() {
        const cashoutAmount = parseFloat(cashoutValue.textContent.replace(/,/g, '').replace(' INR', '')) || 0;
        let currentBalance = parseFloat(balanceElements[0].textContent.replace(/,/g, '')) || 0;
        currentBalance += cashoutAmount;

        balanceElements.forEach(element => {
            if (element === footerBalanceElement) {
                setTimeout(() => {
                    element.innerHTML = `<span>₹</span> ${formatNumber(currentBalance)}`;
                }, 2000); // 2-second delay for footerBalanceElement
            } else {
                element.innerHTML = `${formatNumber(currentBalance)} <span class="text-white-50 ml-1">INR</span>`;
            }
        });

        const balanceAddingElements = document.querySelectorAll('.balance-adding');

        balanceAddingElements.forEach(balanceAddingElement => {
            balanceAddingElement.textContent = `+ ${formatNumber(cashoutAmount)} INR`;
            balanceAddingElement.classList.add('show');
        });
    }

    setOpacity(btnRandom);

    // Event listeners
    document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
        const toggle = dropdown.querySelector('[data-dropdown-toggle]');
        const menu = dropdown.querySelector('[data-dropdown-menu]');
        menu.style.display = 'none';

        toggle.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });

    btnBet.addEventListener('click', () => {
        if (desiredClickCount === 0) {
            generateMines();
        }
        elementsToDisable.forEach(element => element.setAttribute('disabled', 'true'));
        btnBet.classList.add('hidden');
        removeOpacity(btnRandom);
        btnCashout.classList.remove('hidden');
        document.querySelectorAll('div.mines-item').forEach(div => {
            div.classList.add('mines-open');
            div.removeAttribute('disabled'); // Enable mines items
        });
        updateBalance(); // Update balance when bet is placed
    });

    document.querySelectorAll('.fast-bets-menu-button .button-bets').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.fast-bets-menu-button .button-bets').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            document.querySelector('.input-wrapper .input').value = button.textContent;
            localStorage.setItem('inputFields', button.textContent); // Save the value to local storage
        });
    });

    document.querySelector('.button.prev').addEventListener('click', () => {
        inputField.value = Math.max(0, (parseFloat(inputField.value) - 0.10).toFixed(2));
        localStorage.setItem('inputFields', inputField.value); // Save the value to local storage
    });
    document.querySelector('.button.next').addEventListener('click', () => {
        inputField.value = (parseFloat(inputField.value) + 0.10).toFixed(2);
        localStorage.setItem('inputFields', inputField.value); // Save the value to local storage
    });

    document.querySelectorAll('.mines-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            minesItemClickCount++;
            console.log(`Mines-item clicked ${minesItemClickCount} times`); // Log the click count

            item.classList.add('mines-prom');
            setTimeout(() => {
                item.classList.remove('mines-prom');
            }, 500); // 0.5 seconds delay

            // Toggle blink effect on btnRandom and btnCashout
            const btnRandom = document.querySelector('.button-random');
            const btnCashout = document.querySelector('.btn-cashout');

            btnRandom.classList.add('blink');
            btnCashout.classList.add('blink');

            setTimeout(() => {
                btnRandom.classList.remove('blink');
                btnCashout.classList.remove('blink');
            }, 500); // Adjust the delay as needed

            if (minesItemClickCount === desiredClickCount) {
                generateMines(index);
            }
        });
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(event) {
            document.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            selectedMines = parseInt(this.textContent, 10);
            localStorage.setItem('selectedMines', selectedMines); // Save to local storage
            console.log('Selected Mines:', selectedMines);
            clickCount = 0;
            updateCoefficientDisplay();
            updateProgressBar();

            const dropdownToggle = this.closest('.dropdown').querySelector('.dropdown-toggle span');
            dropdownToggle.textContent = `Mines: ${this.textContent}`;

            const dropdownMenu = this.closest('[data-dropdown-menu]');
            dropdownMenu.style.display = 'none';
        });
    });

    inputField.addEventListener('focus', () => {
        inputField.value = '';
    });

    numpadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent.trim();
            if (value === '.') {
                if (!inputFields.value.includes('.')) {
                    inputFields.value += value;
                }
            } else {
                inputFields.value += value;
            }
            localStorage.setItem('inputFields', inputFields.value); // Save the value to local storage
        });
    });

    deleteButton.addEventListener('click', () => {
        inputFields.value = inputFields.value.slice(0, -1);
        localStorage.setItem('inputFields', inputFields.value); // Save the value to local storage
    });

    confirmButton.addEventListener('click', () => {
        // Apply the value without showing an alert
        console.log(`Confirmed value: ${inputFields.value}`);

        // Format the input field value
        const numericValue = inputFields.value.replace(/,/g, ''); // Remove existing commas
        if (!isNaN(numericValue) && numericValue.trim() !== '') {
            inputFields.value = formatNumber(numericValue);
        }

        // Hide the dropdown menu
        const dropdownMenu = document.querySelector('.dropdown-menu[data-dropdown-menu]');
        if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
        }
    });

    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            setTimeout(() => {
                if (mineIndices.includes(index)) {
                    cell.classList.add('mines-item-explosion');
                    revealAllCells();
                } else {
                    cell.classList.add('mines-item-yellow-star');
                }
                updateCashoutValue();
                clickCount++;
                updateCoefficientDisplay();
                updateProgressBar();
            }, 200); // 0.5 seconds delay
        });
    });

    btnCashout.addEventListener('click', () => {
        setOpacity(btnRandom);
        setOpacity(btnCashout);
        cashOut();
        elementsToDisable.forEach(element => element.removeAttribute('disabled'));
        clickCount = 0;
        generateMines();
        updateCoefficientDisplay();
        updateProgressBar();
        revealAllCells();
    });

    // Format input field value on input
    inputFields.addEventListener('input', () => {
        const numericValue = inputFields.value.replace(/,/g, ''); // Remove existing commas
        if (!isNaN(numericValue) && numericValue.trim() !== '') {
            inputFields.value = formatNumber(numericValue);
        }
        localStorage.setItem('inputFields', inputFields.value); // Save the value to local storage
    });

    // Initial formatting for input field
    inputFields.value = formatNumber(inputFields.value);

    updateCoefficientDisplay();
    updateProgressBar();
});