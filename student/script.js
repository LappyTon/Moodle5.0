document.addEventListener('DOMContentLoaded', function() {
    const userCells = document.querySelectorAll('.sm-subject_cell');
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
    mmactive.forEach((cell) => {
        cell.addEventListener('click', function() {
            mmactive.forEach(function(cell) {
                cell.classList.remove('active');
            });
            this.classList.add('active');
        });
    })
});
function truncateText(className, maxHeight) {
    let element = document.querySelector("." + className);
    if (!element) return; 
    let elementText = element.textContent.split('');
    while (element.clientHeight > maxHeight && elementText.length > 1) {
        elementText.pop();
        element.textContent = elementText.join('') + '...';
    }
}
function settingsHover() {
    let settings = document.querySelector('.cs-settingsbtn');
    let div = document.querySelector('.cs-settings_wrapper')
    settings.addEventListener('click', function() {
        if (window.getComputedStyle(div).display=='none') {
            div.style.display = "flex";
        } else {
            div.style.display = "none";
        }
    })
}

window.onload = function () {
    settingsHover()
    truncateText("cs-task-txt", 50);
    truncateText("cs-nametxt", 30);
    truncateText("cs-typetxt", 30);
};
