document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const className = document.getElementById('className').value;

    try {
        const response = await fetch('https://server-for-moodle5-0.onrender.com/auth/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, roles: [role], className })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const result = await response.json();
        alert(`Success: ${result.message}`);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert(`Error: ${error.message}`);
    }
});
