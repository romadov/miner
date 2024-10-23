document.addEventListener('DOMContentLoaded', () => {
    // Dropdown toggle functionality
    document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
        const toggle = dropdown.querySelector('[data-dropdown-toggle]');
        const menu = dropdown.querySelector('[data-dropdown-menu]');
        menu.style.display = 'none';

        toggle.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Bet button functionality
    const btnBet = document.querySelector('.btn-bet');
    const btnCashout = document.querySelector('.btn-cashout');
    const elementsToDisable = document.querySelectorAll('.bet-input-wrapper, .number-of-mines, .game-mode-toggle, .dropdown-game');
    const minesItems = document.querySelectorAll('.mines-item');

    // Initially disable mines items
    minesItems.forEach(item => item.setAttribute('disabled', 'true'));

    btnBet.addEventListener('click', () => {
        elementsToDisable.forEach(element => element.setAttribute('disabled', 'true'));
        btnBet.classList.add('hidden');
        btnCashout.classList.remove('hidden');
        document.querySelectorAll('div.mines-item').forEach(div => {
            div.classList.add('mines-open');
            div.removeAttribute('disabled'); // Enable mines items
        });
    });

    // Fast bets menu functionality
    document.querySelectorAll('.fast-bets-menu-button .button-bets').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.fast-bets-menu-button .button-bets').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            document.querySelector('.input-wrapper .input').value = button.textContent;
        });
    });

    // Increment and decrement buttons functionality
    const inputField = document.querySelector('.input-wrapper .input');
    document.querySelector('.button.prev').addEventListener('click', () => {
        inputField.value = Math.max(0, (parseFloat(inputField.value) - 0.10).toFixed(2));
    });
    document.querySelector('.button.next').addEventListener('click', () => {
        inputField.value = (parseFloat(inputField.value) + 0.10).toFixed(2);
    });

    // Mines item click functionality
    minesItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.add('mines-item-yellow-star');
        });
    });

    // Coefficient display functionality
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

    let selectedMines = 4;
    let clickCount = 0;
    const totalCells = 25; // Total number of cells
    const progressBar = document.querySelector('.progress-bar');

    function updateCoefficientDisplay() {
        const nextTileElement = document.querySelector('.next-tile span:nth-child(2)');
        if (nextTileElement && coefficients[selectedMines] && coefficients[selectedMines][clickCount]) {
            nextTileElement.textContent = `${coefficients[selectedMines][clickCount]}x`;
        }
    }

    function updateProgressBar() {
        const freeCells = totalCells - selectedMines;
        const progressPercentage = (clickCount / freeCells) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            selectedMines = parseInt(this.textContent, 10);
            clickCount = 0;
            updateCoefficientDisplay();
            updateProgressBar();

            // Update the button text with the selected number of mines
            const dropdownToggle = this.closest('.dropdown').querySelector('.dropdown-toggle span');
            dropdownToggle.textContent = `Mines: ${this.textContent}`;

            // Hide the dropdown menu
            const dropdownMenu = this.closest('[data-dropdown-menu]');
            dropdownMenu.style.display = 'none';
        });
    });

    document.querySelectorAll('.mines-item').forEach(item => {
        item.addEventListener('click', () => {
            clickCount++;
            updateCoefficientDisplay();
            updateProgressBar();
        });
    });

    updateCoefficientDisplay();
    updateProgressBar();
});

document.addEventListener('DOMContentLoaded', () => {
    const totalCells = 25; // Total number of cells
    let mineIndices = [];
    let selectedMines = 4; // Number of mines
    const cells = document.querySelectorAll('.mines-item');

    // Generate random mine indices
    function generateMines() {
        mineIndices = [];
        while (mineIndices.length < selectedMines) {
            const randomIndex = Math.floor(Math.random() * totalCells);
            if (!mineIndices.includes(randomIndex)) {
                mineIndices.push(randomIndex);
            }
        }
    }

    // Initialize mines
    generateMines();

    // Handle cell click
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (mineIndices.includes(index)) {
                cell.classList.add('mines-item-explosion');
                revealAllCells();
            } else {
                cell.classList.add('mines-item-yellow-star');
            }
        });
    });

    // Reveal all cells
    function revealAllCells() {
        cells.forEach((cell, index) => {
            if (!cell.classList.contains('mines-item-yellow-star')) {
                if (mineIndices.includes(index)) {
                    if (!cell.classList.contains('mines-item-explosion')) {
                        cell.classList.add('mines-item-bomb');
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    }
                } else {
                    cell.classList.add('mines-item-star');
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const btnBet = document.querySelector('.btn-bet');
    const cashoutValueElement = document.querySelector('.btn-control-value');
    const inputField = document.querySelector('.input-wrapper .input');
    const nextTileElement = document.querySelector('.next-tile span:nth-child(2)');
    const minesItems = document.querySelectorAll('.mines-item');
    let cashoutValue = 0.00;
    let betAmount = 0;
    let coefficient = 1;
    let firstClick = true;

    // Function to update the cashout value
    function updateCashoutValue() {
        if (firstClick) {
            betAmount = parseFloat(inputField.value);
            coefficient = parseFloat(nextTileElement.textContent);
            firstClick = false;
        }
        cashoutValue = betAmount * coefficient;
        cashoutValueElement.textContent = cashoutValue.toFixed(2) + ' USD';
    }

    // Reset cashout value on bet button click
    btnBet.addEventListener('click', () => {
        cashoutValue = 0.00;
        cashoutValueElement.textContent = cashoutValue.toFixed(2) + ' USD';
        firstClick = true;
    });

    // Update cashout value on each mines-item click
    minesItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!item.hasAttribute('disabled')) {
                updateCashoutValue();
            }
        });
    });
});