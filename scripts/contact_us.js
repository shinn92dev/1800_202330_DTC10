const email = document.getElementById("email");
const fullName = document.getElementById("fullname");
const message = document.getElementById("message");
const submitBtn = document.querySelector("#contact-us-submit-btn");

// Check Email address format by using Regex
function isValidEmail(email) {
    // return true when email is valid format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

// Get Email data
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

// Get fullname and validate it
function checkFullName() {
    const fullNameValue = fullName.value.trim();
    // If not valid, display warning message
    if (fullNameValue.length == 0) {
        fullName.classList.add("is-invalid");
        fullName.classList.remove("is-valid");
        return [false];
    } else {
        // If valid, delete warning message if warning message is exist, and return right value
        fullName.classList.remove("is-invalid");
        fullName.classList.add("is-valid");
        return [true, fullNameValue];
    }
}

// Get message and validate it
function checkMessage() {
    const messageValue = message.value.trim();
    // If not valid, display warning message
    if (messageValue.length == 0) {
        message.classList.add("is-invalid");
        message.classList.remove("is-valid");
        return [false];
    } else {
        // If valid, delete warning message if warning message is exist, and return right value
        message.classList.remove("is-invalid");
        message.classList.add("is-valid");
        return [true, messageValue];
    }
}

// Invoke functions to display warning messages
function displayErrorMessage() {
    checkMessage();
    checkEmail();
    checkFullName();
}

// Validate the entire form
function validateForm(e) {
    e.preventDefault();
    displayErrorMessage();

    // When all are valid, create feedback object and store it to firestore
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

// Get corresponding Ids and set them on the textarea
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

// add user uid to feedbacks object when user is logged in and store it  to firestore
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
