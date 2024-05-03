const password = document.getElementById("login_password"),
email = document.getElementById("login_email"),

login1 = document.getElementById('login1'),
login2 = document.getElementById('login2'),
login3 = document.getElementById('login3'),
login4 = document.getElementById('login4'),
login5 = document.getElementById('login5'),
login6 = document.getElementById('login6'),

buttonWorking = document.getElementById('btnworking'),
buttonNotWorking = document.getElementById('btnnotworking');
let myerror = 0;

const emailDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'aol.com',
    'icloud.com',
    'protonmail.com',
    'mail.com',
    'zoho.com',
    'gmx.com',
    'yandex.com',
    'fastmail.com'
];
const regex = /^[a-zA-Z0-9_\-.,]+$/;



function validatePassword() {
    const value = password.value;
    if (value === "") return;
    
    login1.style.display = value.indexOf(' ')>=0 ? 'flex' : 'none';
    login6.style.display = regex.test(value) ? 'none' : 'flex';
    login4.style.display = value.length < 8 ? 'flex' : 'none';
    login5.style.display = value.length > 100 ? 'flex' : 'none';
}

function validateEmail() {
    const value = email.value.trim();
    if (value === "") return;

    login2.style.display = !value.includes('@') ? 'flex' : 'none';
    login3.style.display = !emailDomains.includes(value.slice(1 + value.indexOf('@'))) ? 'flex' : 'none';
}

function toggleButtonVisibility() {
    const passwordValue = password.value.trim();
    const emailValue = email.value.trim();

    if (myerror === 0 && passwordValue !== "" && emailValue !== "") {
        buttonNotWorking.style.display = 'none';
        buttonWorking.style.display = 'block';
    } else {
        buttonNotWorking.style.display = 'block';
        buttonWorking.style.display = 'none';
    }
}

password.addEventListener("input", () => {
    myerror = 0;
    validatePassword();
    toggleButtonVisibility();
});

email.addEventListener("input", () => {
    myerror = 0;
    validateEmail();
    toggleButtonVisibility();
});