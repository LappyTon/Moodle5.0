document.addEventListener('DOMContentLoaded', function () {
    var usernameModal = new bootstrap.Modal(document.getElementById('usernameModal'), {
        backdrop: 'static',
        keyboard: false
    });

    usernameModal.show();

    document.getElementById('submit-username').addEventListener('click', async function () {
        const username = document.getElementById('username').value;
        if (username) {
            const response = await fetch('http://localhost:5000/auth/personalCabinet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            if (response.ok) {
                const data = await response.json();
                populateProgress(data.progress);
                usernameModal.hide();
            } else {
                alert('Помилка при отриманні прогресу.');
            }
        } else {
            alert('Будь ласка, введіть ім\'я користувача.');
        }
    });

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
});