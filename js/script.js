const password = document.getElementById("login_password"),
email = document.getElementById("login_email"),

login1 = document.getElementById('login1'),
login2 = document.getElementById('login2'),
login3 = document.getElementById('login3'),

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

const commonPasswords = [
    "123456", "password", "123456789", "12345678", "12345", 
    "1234567", "1234567890", "123123", "password1", "abc123", 
    "1234", "qwerty", "123456a", "123", "iloveyou", 
    "12345678910", "welcome", "monkey", "password123", "123456789a", 
    "123456789b", "123456789c", "admin", "passw0rd", "password!",
    "123456789d", "123456789e", "login", "pass123", "letmein", 
    "password12", "123456789f", "123456789g", "starwars", "123123123", 
    "test", "password1234", "123456789h", "123456789i", "123456789j", 
    "123abc", "123456789k", "987654321", "9876543211", "123456789m", "123456789n", 
    "password2", "password12345", "123456789o", "123456789p", "password123456",
    "123456789q", "123456789r", "password1234", "123456789s", "123456789t", 
    "123456789u", "123456789v", "qwerty123", "password123456789", "123456789w", 
    "123456789x", "password123!", "123456789y", "123456789z", "qwertyuiop", 
    "1234567890a", "1234567890b", "password1234567", "1234567890c", "1234567890d", 
    "1234567890e", "1234567890f", "password12345678", "1234567890g", "1234567890h", 
    "1234567890i", "password1234567890", "1234567890j", "1234567890k", "1234567890l", 
    "1234567890m", "1234567890n", "1234567890o", "1234567890p", "1234567890q", 
    "1234567890r", "1234567890s", "1234567890t", "1234567890u", "1234567890v", 
    "1234567890w", "1234567890x", "1234567890y", "1234567890z", "12345678900", 
    "12345678901", "12345678902", "12345678903", "12345678904", "12345678905", 
    "12345678906", "12345678907", "12345678908", "12345678909", "123456789010", 
];

function validatePassword() {
    const value = password.value.trim();
    if (value === "") return;

    login1.style.display = commonPasswords.includes(value) ? 'flex' : 'none';
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
