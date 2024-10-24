document.getElementById('clear-btn').addEventListener('click', () => {
    localStorage.clear();
    alert('All settings have been cleared.');
});