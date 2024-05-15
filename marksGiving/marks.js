document.addEventListener('DOMContentLoaded', function() {
    const userCells = document.querySelectorAll('.m_user-cell');
    const mmactive = document.querySelectorAll('.mm-activity_btn')
    userCells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            userCells.forEach(function(cell) {
                cell.classList.remove('active');
            });
            this.classList.add('active');
            const marks = document.querySelector(".usermarks"); // Target the first button
            marks.classList.add('flex'); // Add the 'flex' class
        });
    });
    console.log(mmactive);
    mmactive.forEach((cell) => {
        cell.addEventListener('click', function() {
            mmactive.forEach(function(cell) {
                cell.classList.remove('active');
            });
            this.classList.add('active');
        });
    })
});
