document.addEventListener('DOMContentLoaded', function() {
    let mineIndices = [];
    let gameActive = false;
    let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 3000.00;
    let coefficients = {
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
    let currentCoefficient = 1.10;
    let firstClick = false;
    let progressBar = document.getElementById('progress-bar');
    let progress = 0;
    let clickedCells = [];

    // Retrieve bet amount and selected number of mines from localStorage
    let savedBetAmount = localStorage.getItem('betAmount');
    if (savedBetAmount) {
        document.getElementById('bet-input').value = savedBetAmount;
    }

    let savedMineCount = localStorage.getItem('mineCount');
    if (savedMineCount) {
        document.querySelector('.select-selected').dataset.value = savedMineCount;
        document.querySelector('.select-selected').innerHTML = `mines: ${savedMineCount} <img src="img/icon-dd-arrow.svg" alt="Down Arrow" class="arrow-icon">`;
        updateCoefficient(parseInt(savedMineCount));
    }

    document.querySelectorAll('.cell').forEach(function(cell, index) {
        cell.addEventListener('click', function() {
            if (!gameActive) return; // Если игра не активна, клики не обрабатываются

            // Отмечаем ячейку как "flipped" и добавляем в список кликнутых
            cell.classList.add('flipped');
            clickedCells.push(index);

            setTimeout(() => {
                // Если это ячейка с миной
                if (mineIndices.includes(index)) {
                    cell.style.backgroundImage = "url('img/bomb.png')";
                    gameActive = false; // Остановка игры
                    handleMineHit(index); // Обработка удара мины

                    // Когда мина найдена, раскрываем остальные ячейки
                    revealAllCells(index);

                } else {
                    // Если это не мина, показываем звезду
                    cell.style.backgroundImage = "url('img/star.png')";

                    // Логика обновления коэффициентов и прогресса
                    currentCoefficient *= 1.15;
                    document.getElementById('next-btn').textContent = `Next: ${currentCoefficient.toFixed(2)}x`;

                    let betAmount = parseFloat(document.getElementById('bet-input').value);
                    let cashoutAmount = betAmount * currentCoefficient;
                    const currencySymbol = localStorage.getItem('currencySymbol') || 'USD';
                    document.getElementById('cashout-amount').textContent = `${cashoutAmount.toFixed(2)} ${currencySymbol}`;

                    // Обновляем прогресс
                    progress += 4.2;
                    if (progress > 100) progress = 100;
                    progressBar.style.width = `${progress}%`;
                }
            }, 300);
        });
    });

    function handleMineHit(hitIndex) {
        let cells = document.querySelectorAll('.cell');
        cells[hitIndex].style.backgroundImage = "url('img/bomb.png')";
        revealAllCells(hitIndex);

        let betAmount = parseFloat(document.getElementById('bet-input').value);
        totalAmount -= betAmount;
        updateTotalAmount();

        // Save bet amount and selected number of mines to localStorage
        localStorage.setItem('betAmount', betAmount);
        localStorage.setItem('mineCount', document.querySelector('.select-selected').dataset.value);

        setTimeout(() => {
            location.reload();
        }, 3000);
    }

    function updateTotalAmount() {
        const currencySymbol = localStorage.getItem('currencySymbol') || 'USD';
        document.querySelector('.currency').textContent = `${totalAmount.toFixed(2)} ${currencySymbol}`;
        localStorage.setItem('totalAmount', totalAmount.toFixed(2));
    }

    function updateCoefficient(mineCount) {
        currentCoefficient = coefficients[mineCount];
        document.getElementById('next-btn').textContent = `Next: ${currentCoefficient.toFixed(2)}x`;
    }

    function revealAllCells(hitIndex) {
        let cells = document.querySelectorAll('.cell');
        cells.forEach(function(cell, index) {
            setTimeout(() => {
                if (index !== hitIndex) {
                    if (mineIndices.includes(index)) {
                        cell.style.backgroundImage = "url('img/opened-bomb.png')";
                    } else if (clickedCells.includes(index)) {
                        cell.style.backgroundImage = "url('img/star.png')";
                    } else {
                        cell.style.backgroundImage = "url('img/opened-star.png')";
                    }
                }
            }, 300);
        });
    }

    document.getElementById('bet-btn').addEventListener('click', function() {
        let betAmount = parseFloat(document.getElementById('bet-input').value);
        let cashoutAmount = betAmount * currentCoefficient;
        const currencySymbol = localStorage.getItem('currencySymbol') || 'USD';

        if (gameActive) {
            totalAmount += cashoutAmount;
            updateTotalAmount();
            document.getElementById('cashout-amount').textContent = `${cashoutAmount.toFixed(2)} ${currencySymbol}`;
            document.getElementById('cashout-amount-display').textContent = `+${cashoutAmount.toFixed(2)} ${currencySymbol}`;
            document.getElementById('cashout-amount-display').style.display = 'inline';
            gameActive = false;
            document.getElementById('bet-btn').innerHTML = '<img src="img/icon-play.svg" alt="Play Icon" class="icon-play"> Bet';
            document.getElementById('bet-btn').style.backgroundImage = '';
            document.getElementById('bet-btn').style.paddingTop = '';
            document.getElementById('cashout-amount').style.display = 'none';

            revealAllCells();

            // Save bet amount and selected number of mines to localStorage
            localStorage.setItem('betAmount', betAmount);
            localStorage.setItem('mineCount', document.querySelector('.select-selected').dataset.value);

            setTimeout(() => {
                location.reload();
            }, 3000);
        } else {
            let mineCount = parseInt(document.querySelector('.select-selected').dataset.value);
            let cells = document.querySelectorAll('.cell');
            mineIndices = [];
            gameActive = true;
            firstClick = false;
            clickedCells = [];
            document.getElementById('bet-btn').innerHTML = 'CASHOUT';
            document.getElementById('bet-btn').style.backgroundImage = 'radial-gradient(44% 44% at 49.36% 52%, #dba355 0%, #c4872e 100%)';
            document.getElementById('bet-btn').style.paddingTop = '0';

            while (mineIndices.length < mineCount) {
                let randomIndex = Math.floor(Math.random() * cells.length);
                if (!mineIndices.includes(randomIndex)) {
                    mineIndices.push(randomIndex);
                }
            }

            cells.forEach(function(cell) {
                cell.style.backgroundImage = "url('img/dark-field.png')";
            });

            document.getElementById('cashout-amount').textContent = `0.00 ${currencySymbol}`;
            document.getElementById('cashout-amount').style.display = 'block';
        }
    });

    document.getElementById('random-btn').addEventListener('click', function() {
        if (!gameActive) return;
        makeRandomMove();
    });

    document.querySelectorAll('.select-items div').forEach(function(item) {
        item.addEventListener('click', function() {
            let mineCount = parseInt(this.dataset.value);
            updateCoefficient(mineCount);
        });
    });

    updateTotalAmount();
});