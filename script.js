function truncateText(className, maxHeight) {
    let element = document.querySelector("." + className);
    if (!element) return; 
    let elementText = element.textContent.split('');
    while (element.clientHeight > maxHeight && elementText.length > 1) {
        elementText.pop();
        element.textContent = elementText.join('') + '...';
    }
}

window.onload = function () {
    truncateText("cs-task-txt", 50);
    truncateText("cs-nametxt", 30);
    truncateText("cs-typetxt", 30);
};
