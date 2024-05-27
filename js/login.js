document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = document.getElementById('login_email').value;
            const password = document.getElementById('login_password').value;

            try {
                const response = await fetch('https://server-for-moodle5-0.onrender.com/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    showAlert(`Error: ${errorData.message}`, 'danger');
                    throw new Error(errorData.message);
                }

                const result = await response.json();
                showAlert(`Success: ${result.message}`, 'success');
            } catch (error) {
                showAlert(`Error: ${error.message}`, 'danger');
                console.error('There was a problem with the fetch operation:', error);
            }
        });
    } else {
        console.error('Login form not found');
    }

    function showAlert(message, type) {
        const alertPlaceholder = document.getElementById('alertPlaceholder');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.role = 'alert';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertPlaceholder.appendChild(alert);
    }
});
