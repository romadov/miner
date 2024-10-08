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

    const defaultValue = selectSelected.getAttribute('data-value');
    nextBtn.innerHTML = `Next: ${coefficients[defaultValue].toFixed(2)}x`;

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
            nextBtn.innerHTML = `Next: ${coefficients[value].toFixed(2)}x`;

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
        currentCoefficient = coefficients[selectedMines];
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

                currentCoefficient *= 1.1;
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
        nextBtn.innerHTML = `Next: ${coefficients[selectSelected.getAttribute('data-value')].toFixed(2)}x`;

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