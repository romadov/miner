document.addEventListener('DOMContentLoaded', function() {
    let mineIndices = [];
    let gameActive = false;
    let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 3000.00; // Load total amount from localStorage or set to initial value
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
    let currentCoefficient = 1.10; // Default coefficient
    let firstClick = false; // Flag to track the first click

    // Function to update the total amount displayed
    function updateTotalAmount() {
        const currencySymbol = localStorage.getItem('currencySymbol') || 'USD';
        document.querySelector('.currency').textContent = `${totalAmount.toFixed(2)} ${currencySymbol}`;
        localStorage.setItem('totalAmount', totalAmount.toFixed(2)); // Save total amount to localStorage
    }

    // Function to update the coefficient based on the number of mines
    function updateCoefficient(mineCount) {
        currentCoefficient = coefficients[mineCount];
        document.getElementById('next-btn').textContent = `Next: ${currentCoefficient.toFixed(2)}x`;
    }

    // Function to handle mine hit
    function handleMineHit(index) {
        console.log('Mine hit at index:', index); // Debugging log
        let betAmount = parseFloat(document.getElementById('bet-input').value);
        totalAmount -= betAmount;
        updateTotalAmount();
        revealAllCells(index); // Pass the index of the hit mine

        // Revert the Bet button to its original state
        document.getElementById('bet-btn').innerHTML = '<img src="img/icon-play.svg" alt="Play Icon" class="icon-play"> Bet';
        document.getElementById('bet-btn').style.backgroundImage = ''; // Reset button background
        document.getElementById('bet-btn').style.paddingTop = ''; // Remove padding-top style

        // Hide the cashout amount
        document.getElementById('cashout-amount').style.display = 'none';

        // Disable all interactive elements
        document.querySelectorAll('.cell').forEach(cell => {
            cell.style.pointerEvents = 'none';
        });
        document.getElementById('bet-btn').disabled = true;
        document.getElementById('random-btn').disabled = true;

        // Reload the game after 3 seconds
        setTimeout(() => {
            console.log('Reloading game...'); // Debugging log
            location.reload();
        }, 3000);
    }



// Function to reveal all cells
    function revealAllCells(hitMineIndex) {
        let cells = document.querySelectorAll('.cell');
        cells.forEach(function(cell, index) {
            cell.classList.add('flipped');
            setTimeout(() => {
                if (mineIndices.includes(index)) {
                    cell.style.backgroundImage = "url('img/bomb.png')";
                } else {
                    cell.style.backgroundImage = "url('img/star.png')";
                }
            }, 300); // Delay to allow the flip animation to complete
        });
    }

    // Event listener for the bet button
    document.getElementById('bet-btn').addEventListener('click', function() {
        let betAmount = parseFloat(document.getElementById('bet-input').value);
        let cashoutAmount = betAmount * currentCoefficient;

        if (gameActive) {
            // Cashout logic
            totalAmount += cashoutAmount;
            updateTotalAmount();
            document.getElementById('cashout-amount').textContent = `${cashoutAmount.toFixed(2)} USD`;
            gameActive = false;
            document.getElementById('bet-btn').innerHTML = '<img src="img/icon-play.svg" alt="Play Icon" class="icon-play"> Bet';
            document.getElementById('bet-btn').style.backgroundImage = ''; // Reset button background
            document.getElementById('bet-btn').style.paddingTop = ''; // Remove padding-top style
            document.getElementById('cashout-amount').style.display = 'none'; // Hide the cashout amount
        } else {
            // Start game logic
            let mineCount = parseInt(document.querySelector('.select-selected').dataset.value);
            let cells = document.querySelectorAll('.cell');
            mineIndices = [];
            gameActive = true;
            firstClick = false; // Reset the first click flag
            document.getElementById('bet-btn').innerHTML = 'Cashout';
            document.getElementById('bet-btn').style.backgroundImage = 'radial-gradient(44% 44% at 49.36% 52%, #dba355 0%, #c4872e 100%)'; // Change button background
            document.getElementById('bet-btn').style.paddingTop = '0'; // Add padding-top style

            while (mineIndices.length < mineCount) {
                let randomIndex = Math.floor(Math.random() * cells.length);
                if (!mineIndices.includes(randomIndex)) {
                    mineIndices.push(randomIndex);
                }
            }

            cells.forEach(function(cell) {
                cell.style.backgroundImage = "url('img/field.png')";
            });

            // Display the initial cashout amount
            document.getElementById('cashout-amount').textContent = `0.00 USD`;
            document.getElementById('cashout-amount').style.display = 'block'; // Show the cashout amount div
        }
    });

    // Event listener for cell clicks
    document.querySelectorAll('.cell').forEach(function(cell, index) {
        cell.addEventListener('click', function() {
            if (!gameActive) return;

            cell.classList.add('flipped');
            setTimeout(() => {
                if (mineIndices.includes(index)) {
                    cell.style.backgroundImage = "url('img/bomb.png')";
                    gameActive = false;
                    handleMineHit(index); // Call handleMineHit when a mine is hit
                } else {
                    cell.style.backgroundImage = "url('img/star.png')";
                    // Increase the coefficient by 15%
                    currentCoefficient *= 1.15;
                    document.getElementById('next-btn').textContent = `Next: ${currentCoefficient.toFixed(2)}x`;

                    // Recalculate and display the updated cashout amount
                    let betAmount = parseFloat(document.getElementById('bet-input').value);
                    let cashoutAmount = betAmount * currentCoefficient;
                    document.getElementById('cashout-amount').textContent = `${cashoutAmount.toFixed(2)} USD`;
                }
            }, 300); // Delay to allow the flip animation to complete
        });
    });

    // Event listener for the random button
    document.getElementById('random-btn').addEventListener('click', function() {
        if (!gameActive) return;
        makeRandomMove();
    });

    // Event listener for mine selection
    document.querySelectorAll('.select-items div').forEach(function(item) {
        item.addEventListener('click', function() {
            let mineCount = parseInt(this.dataset.value);
            updateCoefficient(mineCount);
        });
    });

    // Initial update of the total amount
    updateTotalAmount();
});