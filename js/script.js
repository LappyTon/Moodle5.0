const password = document.getElementById("login_password");
const email = document.getElementById("login_email");
let myerror = 0;

const login1 = document.getElementById('login1');
const login2 = document.getElementById('login2');
const login3 = document.getElementById('login3');

const buttonWorking = document.getElementById('btnworking');
const buttonNotWorking = document.getElementById('btnnotworking');

console.log(buttonNotWorking, buttonWorking);

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

if (password) {
    password.addEventListener("input", function() {
        myerror = 0;
        if (password.value.trim() !== "") {
            if (commonPasswords.includes(password.value.trim())) {
                login1.style.display = 'flex';
                myerror++;
            } else {
                login1.style.display = 'none';
            }
            if (password.value.trim().length < 8) {
                login4.style.display = 'flex';
                myerror++;
            } else {
                login4.style.display = 'none';
            }
            if (password.value.trim().length > 100) {
                login5.style.display = 'flex';
                myerror++;
            } else {
                login5.style.display = 'none';
            }
        }
        toggleButtonVisibility();
    });
}

if (email) {
    email.addEventListener("input", function() {
        myerror = 0;
        if (email.value.trim() !== "") {
            if (!email.value.includes('@')) {
                login2.style.display = 'flex';
                myerror++;
            } else {
                login2.style.display = 'none';
            }
            if (!emailDomains.includes(email.value.slice(1 + email.value.indexOf('@')))) {
                login3.style.display = 'flex';
            } else {
                login3.style.display = 'none';
            }
        }
        toggleButtonVisibility();
    });
}

function toggleButtonVisibility() {
    if (myerror === 0 && password.value.trim() !== "" && email.value.trim() !== "") {
        buttonNotWorking.style.display = 'none';
        buttonWorking.style.display = 'block';
    } else {
        buttonNotWorking.style.display = 'block';
        buttonWorking.style.display = 'none';
    }
}
