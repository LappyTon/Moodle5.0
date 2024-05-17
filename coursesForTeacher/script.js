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
