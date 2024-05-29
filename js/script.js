// Обробка форми входу
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:5000/auth/login', { username, password });
        const { token, roles } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('roles', JSON.stringify(roles));
        displayDashboard(roles);
    } catch (error) {
        alert('Не вдалося увійти: ' + error.response.data.message);
    }
});

// Функція для відображення відповідного дашборду на основі ролей користувача
function displayDashboard(roles) {
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('teacherDashboard').classList.add('d-none');
    document.getElementById('studentDashboard').classList.add('d-none');
    document.getElementById('adminDashboard').classList.add('d-none');

    // Приховування всіх навігаційних вкладок
    document.getElementById('teacherDashboardLink').style.display = 'none';
    document.getElementById('studentDashboardLink').style.display = 'none';
    document.getElementById('adminDashboardLink').style.display = 'none';

    if (roles.includes('TEACHER')) {
        document.getElementById('teacherDashboard').classList.remove('d-none');
        document.getElementById('teacherDashboardLink').style.display = 'block';
    } else if (roles.includes('STUDENT')) {
        document.getElementById('studentDashboard').classList.remove('d-none');
        document.getElementById('studentDashboardLink').style.display = 'block';
    } else if (roles.includes('CHIEF-TEACHER')) {
        document.getElementById('adminDashboard').classList.remove('d-none');
        document.getElementById('adminDashboardLink').style.display = 'block';
    }
}

// Відображення відповідного дашборду при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function () {
    const roles = JSON.parse(localStorage.getItem('roles'));
    if (roles) {
        displayDashboard(roles);
    }
});

// Обробка подій для навігаційних посилань
document.getElementById('teacherDashboardLink').addEventListener('click', function () {
    displayDashboard(['TEACHER']);
});

document.getElementById('studentDashboardLink').addEventListener('click', function () {
    displayDashboard(['STUDENT']);

});

document.getElementById('adminDashboardLink').addEventListener('click', function () {
    displayDashboard(['CHIEF-TEACHER']);
});

// Додавання нового поля для виставлення оцінок
document.getElementById('addSubjectRating').addEventListener('click', function () {
    const subjectRatingDiv = document.createElement('div');
    subjectRatingDiv.classList.add('form-group', 'subject-rating');
    subjectRatingDiv.innerHTML = `
        <label for="subject">Предмет</label>
        <input type="text" class="form-control subject" required>
        <label for="rating">Оцінка</label>
        <input type="number" class="form-control rating" required>
    `;
    document.getElementById('subjectRatings').appendChild(subjectRatingDiv);
});

// Обробка форми виставлення оцінок
document.getElementById('addRatingForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const studentName = document.getElementById('studentName').value;
    const date = document.getElementById('date').value;
    const subjectRatingDivs = document.querySelectorAll('.subject-rating');

    const ratings = Array.from(subjectRatingDivs).map(div => ({
        subject: div.querySelector('.subject').value,
        rating: div.querySelector('.rating').value
    }));

    try {
        await axios.post('http://localhost:5000/addRating', { studentName, date, ratings });
        alert('Оцінки успішно додані');
    } catch (error) {
        alert('Не вдалося додати оцінки: ' + error.response.data.message);
    }
});

// Відображення панелі вчителя
document.getElementById('teacherDashboardLink').addEventListener('click', function () {
    displayDashboard(['TEACHER']);
});

// Відображення панелі учня
document.getElementById('studentDashboardLink').addEventListener('click', function () {
    displayDashboard(['STUDENT']);
});

// Відображення панелі адміністратора
document.getElementById('adminDashboardLink').addEventListener('click', function () {
    displayDashboard(['CHIEF-TEACHER']);
});


// Додавання предмета вчителю
document.getElementById('addTeacherSubjectForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const teacherName = document.getElementById('teacherName').value;
    const subjectName = document.getElementById('subjectName').value;

    try {
        await axios.post('http://localhost:5000/addSubjectToTeacher', { teacherName, subjectName });
        alert('Предмет успішно доданий вчителю');
    } catch (error) {
        alert('Не вдалося додати предмет вчителю: ' + error.response.data.message);
    }
});

// Видалення предмета у вчителя
document.getElementById('removeTeacherSubjectForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('teacherUsername').value;
    const subjectId = document.getElementById('removeSubjectId').value;

    try {
        await axios.delete('http://localhost:5000/deleteSubject', { data: { username, subjectId } });
        alert('Предмет успішно видалений у вчителя');
    } catch (error) {
        alert('Не вдалося видалити предмет у вчителя: ' + error.response.data.message);
    }
});

// Додавання предмета
document.getElementById('addSubjectForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const subjectName = document.getElementById('subjectNameAdmin').value;

    try {
        await axios.post('http://localhost:5000/subjects', { name: subjectName });
        alert('Предмет успішно доданий');
    } catch (error) {
        alert('Не вдалося додати предмет: ' + error.response.data.message);
    }
});

// Видалення предмета
document.getElementById('removeSubjectForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const subjectName = document.getElementById('subjectNameToRemove').value;

    try {
        await axios.delete('http://localhost:5000/subjects', { data: { name: subjectName } });
        alert('Предмет успішно видалений');
    } catch (error) {
        alert('Не вдалося видалити предмет: ' + error.response.data.message);
    }
});

// Додавання розкладу
document.getElementById('addScheduleForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('scheduleSubjectName').value;
    const day = document.getElementById('scheduleDay').value;
    const time = document.getElementById('scheduleTime').value;

    try {
        await axios.post('http://localhost:5000/subjects/schedule', { name, day, time });
        alert('Розклад успішно доданий');
    } catch (error) {
        alert('Не вдалося додати розклад: ' + error.response.data.message);
    }
});

// Видалення розкладу
document.getElementById('removeScheduleForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('scheduleSubjectNameToRemove').value;
    const day = document.getElementById('scheduleDayToRemove').value;
    const time = document.getElementById('scheduleTimeToRemove').value;

    try {
        await axios.delete('http://localhost:5000/subjects/schedule', { data: { name, day, time } });
        alert('Розклад успішно видалений');
    } catch (error) {
        alert('Не вдалося видалити розклад: ' + error.response.data.message);
    }
});

// Перегляд розкладу
document.addEventListener('DOMContentLoaded', function () {
    // Функція для отримання розкладів з сервера
    async function fetchSchedules() {
        try {
            const response = await fetch('http://localhost:5000/subjects/schedule');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const schedules = await response.json();
            displaySchedules(schedules);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    }

    // Функція для відображення розкладів
    function displaySchedules(schedules) {
        const scheduleTableBody = document.getElementById('scheduleTableBody');
        scheduleTableBody.innerHTML = ''; // Очистити таблицю перед додаванням нових даних
        schedules.forEach(schedule => {
            schedule.schedule.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${schedule.name}</td>
                    <td>${item.day}</td>
                    <td>${item.time}</td>
                `;
                scheduleTableBody.appendChild(row);
            });
        });
    }

    // Завантаження розкладу при завантаженні сторінки
    fetchSchedules();
});

document.addEventListener('DOMContentLoaded', function () {
    // Додавання класу
    document.getElementById('addClassForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const className = document.getElementById('className').value;

        try {
            const response = await fetch('http://localhost:5000/class', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: className })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            alert('Class added successfully');
            console.log('Class added:', result);
        } catch (error) {
            console.error('Error adding class:', error);
        }
    });

    // Видалення класу
    document.getElementById('removeClassForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const className = document.getElementById('classNameToRemove').value;

        try {
            const response = await fetch('http://localhost:5000/class', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: className })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            alert('Class removed successfully');
            console.log('Class removed:', result);
        } catch (error) {
            console.error('Error removing class:', error);
        }
    });

    // Додавання учня до класу
    document.getElementById('addStudentToClassForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const className = document.getElementById('classNameToAddStudent').value;
        const studentUsername = document.getElementById('studentUsername').value;

        try {
            const response = await fetch('http://localhost:5000/class/add-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ className: className, studentUsername: studentUsername })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            alert('Student added to class successfully');
            console.log('Student added to class:', result);
        } catch (error) {
            console.error('Error adding student to class:', error);
        }
    });
});
