const email = document.getElementById("email");
const fullName = document.getElementById("fullname");
const message = document.getElementById("message");
const submitBtn = document.querySelector('button[type="submit"]');

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

function checkEmail() {
    const emailValue = email.value.trim();
    const isValidValue = isValidEmail(emailValue);
    if (emailValue.length == 0 || !isValidValue) {
        email.classList.add("is-invalid");
        email.classList.remove("is-valid");
        return [false];
    } else {
        email.classList.remove("is-invalid");
        email.classList.add("is-valid");
        return [true, emailValue];
    }
}

function checkFullName() {
    const fullNameValue = fullName.value.trim();
    if (fullNameValue.length == 0) {
        fullName.classList.add("is-invalid");
        fullName.classList.remove("is-valid");
        return [false];
    } else {
        fullName.classList.remove("is-invalid");
        fullName.classList.add("is-valid");
        return [true, fullNameValue];
    }
}
function checkMessage() {
    const messageValue = message.value.trim();
    if (messageValue.length == 0) {
        message.classList.add("is-invalid");
        message.classList.remove("is-valid");
        return [false];
    } else {
        message.classList.remove("is-invalid");
        message.classList.add("is-valid");
        return [true, messageValue];
    }
}

function displayErrorMessage() {
    checkMessage();
    checkEmail();
    checkFullName();
}

function validateForm(e) {
    e.preventDefault();
    displayErrorMessage();

    if (checkEmail()[0] && checkFullName()[0] && checkMessage()[0]) {
        const feedbackArr = [
            checkEmail()[1],
            checkFullName()[1],
            checkMessage()[1],
        ];
    }
}

submitBtn.addEventListener("click", validateForm);
