const email = document.getElementById("email");
const fullName = document.getElementById("fullname");
const message = document.getElementById("message");
const submitBtn = document.querySelector("#contact-us-submit-btn");

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
    if (!submitBtn.disabled) {
        if (checkEmail()[0] && checkFullName()[0] && checkMessage()[0]) {
            const feedbacks = {
                email: checkEmail()[1],
                name: checkFullName()[1],
                message: checkMessage()[1],
            };

            storeFeedbackToFireStore(feedbacks);
        }
    }
}

function displayCorrespondingId() {
    const textArea = document.querySelector("textarea");
    const reviewId = window.localStorage.getItem("reviewId");
    const propertyId = window.localStorage.getItem("propertyId");
    if (propertyId) {
        textArea.textContent += `Property Id: ${propertyId}\n`;
    }
    if (reviewId) {
        textArea.textContent += `Review Id: ${reviewId}\n`;
    }
    window.localStorage.removeItem("propertyId");
    window.localStorage.removeItem("reviewId");
}

function storeFeedbackToFireStore(object) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            object["userUid"] = user.uid;
        }
        db.collection("Feedbacks")
            .doc()
            .set(object)
            .then(() => {
                alert("Thank you for sharing your opinion!");
                submitBtn.disabled = true;
            });
    });
}

submitBtn.addEventListener("click", validateForm);
displayCorrespondingId();
