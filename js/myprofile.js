document.addEventListener('DOMContentLoaded', function () {
    var usernameModal = new bootstrap.Modal(document.getElementById('usernameModal'), {
        backdrop: 'static',
        keyboard: false
    });

    var storedUsername = localStorage.getItem('username');
    var storedRoles = JSON.parse(localStorage.getItem('roles')) || [];

    if (storedUsername) {
        document.getElementById('userDisplayName').textContent = storedUsername;
        displayContentForRole(storedRoles);
        if (!storedRoles.includes('TEACHER') && !storedRoles.includes('CHIEF-TEACHER')) {
            fetchPersonalCabinetData(storedUsername);
        }
    } else {
        usernameModal.show();
    }

    document.getElementById('submit-username').addEventListener('click', function () {
        const username = document.getElementById('username').value;
        if (username) {
            localStorage.setItem('username', username);
            document.getElementById('userDisplayName').textContent = username;
            displayContentForRole(storedRoles);
            if (!storedRoles.includes('TEACHER') && !storedRoles.includes('CHIEF-TEACHER')) {
                fetchPersonalCabinetData(username);
            }
            usernameModal.hide();
        } else {
            alert('Будь ласка, введіть ім\'я користувача.');
        }
    });

    function displayContentForRole(roles) {
        const contentContainer = document.getElementById('content-container');
        const teacherMessage = document.getElementById('teacher-message');
        const teacherNameSpan = document.getElementById('teacherName');
        const userDisplayName = localStorage.getItem('username');

        if (roles.includes('TEACHER') || roles.includes('CHIEF-TEACHER')) {
            contentContainer.style.display = 'none';
            teacherMessage.classList.remove('d-none');
            teacherNameSpan.textContent = userDisplayName;
        } else {
            contentContainer.style.display = 'block';
            teacherMessage.classList.add('d-none');
        }
    }

    function fetchPersonalCabinetData(username) {
        fetchGrades(username);
        fetchSubjects(username);
    }

    function fetchGrades(username) {
        fetch('http://localhost:5000/auth/personalCabinet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(response => response.ok ? response.json() : Promise.reject('Помилка при отриманні прогресу.'))
        .then(data => populateProgress(data.progress))
        .catch(error => alert(error));
    }

    function fetchSubjects(username) {
        fetch('http://localhost:5000/listSTUDENT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(response => response.ok ? response.json() : Promise.reject('Помилка при отриманні предметів.'))
        .then(data => populateSubjects(data))
        .catch(error => alert(error));
    }

    function populateProgress(progress) {
        const dateSlider = document.getElementById('date-slider');
        const ratingsTableBody = document.getElementById('ratings-table-body');
        const selectedDate = document.getElementById('selected-date');

        dateSlider.max = progress.length - 1;

        dateSlider.addEventListener('input', function () {
            const index = dateSlider.value;
            const selectedProgress = progress[index];
            selectedDate.textContent = new Date(selectedProgress.date).toLocaleDateString('uk-UA');

            ratingsTableBody.innerHTML = '';
            selectedProgress.subjects.forEach(subject => {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                nameCell.textContent = subject.name;
                const ratingsCell = document.createElement('td');
                ratingsCell.textContent = subject.ratings.join(', ');
                row.appendChild(nameCell);
                row.appendChild(ratingsCell);
                ratingsTableBody.appendChild(row);
            });
        });

        // Ініціалізуємо початкові значення
        dateSlider.value = 0;
        dateSlider.dispatchEvent(new Event('input'));
    }

    function populateSubjects(data) {
        const subjectsList = document.getElementById('subjects-list');
        subjectsList.innerHTML = '';

        data.forEach(student => {
            const listItem = document.createElement('a');
            listItem.classList.add('list-group-item', 'list-group-item-action');
            listItem.innerHTML = `<h5>${student.username}</h5>${student.subjects.map((subject, index) => `${index + 1}) ${subject}`).join('<br>')}`;
            subjectsList.appendChild(listItem);
        });
    }
});
