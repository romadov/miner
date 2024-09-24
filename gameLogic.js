// gameLogic.js

let mineIndices = [];
let gameActive = false;
let totalAmount = 3000.00; // Initial total amount

// Function to update the total amount displayed
function updateTotalAmount() {
    const currencySymbol = localStorage.getItem('currencySymbol') || 'USD';
    document.querySelector('.currency').textContent = `${totalAmount.toFixed(2)} ${currencySymbol}`;
}

// Function to handle mine hit
function handleMineHit(index) {
    let betAmount = parseFloat(document.getElementById('bet-input').value);
    totalAmount -= betAmount;
    updateTotalAmount();
    revealAllCells(index); // Pass the index of the hit mine
}

// Function to reveal all cells
function revealAllCells(hitMineIndex) {
    let cells = document.querySelectorAll('.cell');
    cells.forEach(function(cell, index) {
        cell.classList.add('flipped');
        setTimeout(() => {
            if (mineIndices.includes(index)) {
                if (index === hitMineIndex) {
                    cell.style.backgroundImage = "url('img/bomb.png')";
                } else {
                    cell.style.backgroundImage = "url('img/real_bomb.png')";
                }
            } else {
                cell.style.backgroundImage = "url('img/star.png')";
            }
        }, 300); // Delay to allow the flip animation to complete
    });
}

// Function to make a random move
function makeRandomMove() {
    let cells = document.querySelectorAll('.cell');
    let availableCells = Array.from(cells).filter(cell => !cell.classList.contains('flipped'));
    if (availableCells.length === 0) return;

    let randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    randomCell.click();
}

// Event listener for the bet button
document.getElementById('bet-btn').addEventListener('click', function() {
    let mineCount = parseInt(document.querySelector('.select-selected').dataset.value);
    let cells = document.querySelectorAll('.cell');
    mineIndices = [];
    gameActive = true;

    while (mineIndices.length < mineCount) {
        let randomIndex = Math.floor(Math.random() * cells.length);
        if (!mineIndices.includes(randomIndex)) {
            mineIndices.push(randomIndex);
        }
    }

    cells.forEach(function(cell) {
        cell.style.backgroundImage = "url('img/field.png')";
    });
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
                handleMineHit(index); // Pass the index of the hit mine
            } else {
                cell.style.backgroundImage = "url('img/star.png')";
            }
        }, 300); // Delay to allow the flip animation to complete
    });
});

// Event listener for the random button
document.getElementById('random-btn').addEventListener('click', function() {
    if (!gameActive) return;
    makeRandomMove();
});

// Initial update of the total amount
updateTotalAmount();