document.addEventListener('DOMContentLoaded', () => {
    // Retrieve desiredClickCount from localStorage
    let desiredClickCount = localStorage.getItem('desiredClickCount') || 0;
    desiredClickCount = parseInt(desiredClickCount, 10);

    // Set the input field value to the retrieved desiredClickCount
    const mineClickPositionInput = document.getElementById('mine-click-position');
    mineClickPositionInput.value = desiredClickCount;

    // Save the desiredClickCount to localStorage when the input field value changes
    mineClickPositionInput.addEventListener('input', (event) => {
        desiredClickCount = parseInt(event.target.value, 10);
        localStorage.setItem('desiredClickCount', desiredClickCount);
    });

    // Clear localStorage and reset the input field
    document.getElementById('clear-btn').addEventListener('click', () => {
        localStorage.clear();
        alert('All settings have been cleared.');
        mineClickPositionInput.value = 0;
    });
});