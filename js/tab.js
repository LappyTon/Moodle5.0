var myTabs = new bootstrap.Tab(document.getElementById('myTabs'));

document.getElementById('task-tab').addEventListener('click', function (event) {
    event.preventDefault();
    myTabs.show('task');
});

document.getElementById('calendar-tab').addEventListener('click', function (event) {
    event.preventDefault();
    myTabs.show('calendar');
});

document.getElementById('group-tab').addEventListener('click', function (event) {
    event.preventDefault();
    myTabs.show('group');
});
