document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:5000/auth/login', { username, password });
        const { token, roles } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('roles', roles);
        displayDashboard(roles);
    } catch (error) {
        alert('Login failed: ' + error.response.data.message);
    }
});

function displayDashboard(roles) {
    document.getElementById('loginForm').classList.add('d-none');
    if (roles.includes('TEACHER')) {
        document.getElementById('teacherDashboard').classList.remove('d-none');
    } else if (roles.includes('STUDENT')) {
        document.getElementById('studentDashboard').classList.remove('d-none');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const roles = localStorage.getItem('roles');
    if (roles) {
        displayDashboard(roles);
    }
});

document.getElementById('addSubjectRating').addEventListener('click', function () {
    const subjectRatingDiv = document.createElement('div');
    subjectRatingDiv.classList.add('form-group', 'subject-rating');
    subjectRatingDiv.innerHTML = `
        <label for="subject">Subject</label>
        <input type="text" class="form-control subject" required>
        <label for="rating">Rating</label>
        <input type="number" class="form-control rating" required>
    `;
    document.getElementById('subjectRatings').appendChild(subjectRatingDiv);
});

document.getElementById('addRatingForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const studentName = document.getElementById('studentName').value;
    const date = document.getElementById('date').value;
    const subjectRatingDivs = document.querySelectorAll('.subject-rating');

    const ratings = Array.from(subjectRatingDivs).map(div => ({
        subject: div.querySelector('.subject').value,
        ratings: div.querySelector('.rating').value
    }));

    try {
        await axios.post('http://localhost:5000/addRating', { studentName, date, ratings });
        alert('Ratings added successfully');
    } catch (error) {
        alert('Failed to add ratings: ' + error.response.data.message);
    }
});

document.getElementById('teacherDashboardLink').addEventListener('click', function () {
    displayDashboard(['TEACHER']);
});

document.getElementById('studentDashboardLink').addEventListener('click', function () {
    displayDashboard(['STUDENT']);
});