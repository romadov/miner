document.getElementById('minus-btn').addEventListener('click', function() {
    let betInput = document.getElementById('bet-input');
    let currentValue = parseFloat(betInput.value);
    if (currentValue > 0.3) {
        betInput.value = (currentValue - 0.1).toFixed(1);
    }
});

document.getElementById('plus-btn').addEventListener('click', function() {
    let betInput = document.getElementById('bet-input');
    let currentValue = parseFloat(betInput.value);
    betInput.value = (currentValue + 0.1).toFixed(1);
});

document.getElementById('dropdown-btn').addEventListener('click', function(event) {
    let dropdownMenu = document.getElementById('dropdown-menu');
    let dropdownBtn = document.getElementById('dropdown-btn');
    let rect = dropdownBtn.getBoundingClientRect();
    dropdownMenu.style.left = `${rect.left + rect.width / 2 - 190}px`; // Move 20px to the left
    dropdownMenu.style.bottom = `${window.innerHeight - rect.top - 65}px`; // Move lower
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    event.stopPropagation(); // Prevent the click event from bubbling up to the document
});

document.addEventListener('click', function(event) {
    let dropdownMenu = document.getElementById('dropdown-menu');
    let dropdownBtn = document.getElementById('dropdown-btn');
    if (!dropdownMenu.contains(event.target) && event.target !== dropdownBtn) {
        dropdownMenu.style.display = 'none';
    }
});

document.querySelectorAll('.dropdown-item').forEach(function(item) {
    item.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-item').forEach(function(i) {
            i.classList.remove('selected');
        });
        this.classList.add('selected');
        document.getElementById('bet-input').value = parseFloat(this.textContent).toFixed(2);
    });
});

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
        cell.style.backgroundImage = "url('img/dark-field.png')"; // Change to dark-field.png
    });
});

document.querySelectorAll('.cell').forEach(function(cell, index) {
    cell.addEventListener('click', function() {
        if (!gameActive) return;

        cell.classList.add('flipped');
        setTimeout(() => {
            if (mineIndices.includes(index)) {
                cell.style.backgroundImage = "url('img/bomb.png')";
                gameActive = false;
                revealAllCells(index);
            } else {
                cell.style.backgroundImage = "url('img/star.png')";
            }
        }, 300); // Delay to allow the flip animation to complete
    });
});

function revealAllCells(hitIndex) {
    let cells = document.querySelectorAll('.cell');
    cells.forEach(function(cell, index) {
        setTimeout(() => {
            if (index !== hitIndex) {
                if (mineIndices.includes(index)) {
                    cell.style.backgroundImage = "url('img/opened-bomb.png')";
                } else {
                    cell.style.backgroundImage = "url('img/opened-star.png')";
                }
            }
        }, 300); // Delay to allow the flip animation to complete
    });
}

document.getElementById('bet-input').addEventListener('click', function() {
    let betInput = document.getElementById('bet-input');
    let keypad = document.getElementById('keypad');
    let rect = betInput.getBoundingClientRect();
    keypad.style.left = `${rect.left - 170}px`; // Move 20px to the left
    keypad.style.bottom = `${window.innerHeight - rect.top + -30}px`; // Move twice as low
    keypad.style.display = 'block';
});

document.querySelectorAll('.keypad-btn').forEach(function(button) {
    button.addEventListener('click', function() {
        let betInput = document.getElementById('bet-input');
        if (this.classList.contains('delete-btn')) {
            betInput.value = betInput.value.slice(0, -1);
        } else if (this.classList.contains('apply-btn')) {
            document.getElementById('keypad').style.display = 'none';
        } else {
            betInput.value += this.textContent;
        }
    });
});

document.addEventListener('click', function(event) {
    let keypad = document.getElementById('keypad');
    let betInput = document.getElementById('bet-input');
    if (!keypad.contains(event.target) && event.target !== betInput) {
        keypad.style.display = 'none';
    }
});

document.querySelector('.select-selected').addEventListener('click', function() {
    this.nextElementSibling.classList.toggle('select-hide');
    this.classList.toggle('select-arrow-active');
});

document.querySelectorAll('.select-items div').forEach(function(item) {
    item.addEventListener('click', function() {
        let selected = document.querySelector('.select-selected');
        selected.innerHTML = `mines: ${this.dataset.value} <img src="img/icon-dd-arrow.svg" alt="Down Arrow" class="arrow-icon">`;
        selected.dataset.value = this.dataset.value;
        this.parentElement.classList.add('select-hide');
    });
});

document.addEventListener('click', function(event) {
    if (!event.target.matches('.select-selected')) {
        document.querySelectorAll('.select-items').forEach(function(item) {
            item.classList.add('select-hide');
        });
    }
});