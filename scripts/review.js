const tags = document.querySelector("#form-tags-box").querySelectorAll("label");
const submitButton = document.querySelector("#review-submit-box button");

let currentUserID;

// Get current user information
const getUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUserID = user.uid;
        } else {
            console.log("No user is signed in");
        }
    });
};

getUser();

const scoresInputs = document
    .querySelector("#form-stars-boxs")
    .querySelectorAll("input");

// Handle tag input click event: by clicking, changing the background color by adding or deleting class
function handleTagBoxClickEvent() {
    tags.forEach((tag) => {
        tag.addEventListener("click", (e) => {
            tag.classList.toggle("checked");
        });
    });
}

// Initialize score inputs: make sure all are set as empty at first
function initializeScoresBox() {
    scoresInputs.forEach((score) => {
        score.value = "";
    });
}

// Initialize tag inputs: make sure all unchecked at first
function initializeCheckBox() {
    const tagInputs = document
        .querySelector("#form-tags-box")
        .querySelectorAll("input");
    tagInputs.forEach((tag) => {
        tag.checked = false;
    });
}

// Handle stars click event: by clicking, fill the corresponding icon
function handlePaintingStars() {
    // Iterate through each score input element with the class "score-input"
    scoresInputs.forEach((input) => {
        // Get the star icons associated with the current input
        const icons = input.previousElementSibling.querySelectorAll("i");

        // Add click event listeners to each star icon
        icons.forEach((icon, index) => {
            icon.addEventListener("click", () => {
                // Calculate the score based on the index of the clicked icon
                const score = index + 1;

                // Update the visual representation of stars based on the score by filling the color
                icons.forEach((star, j) => {
                    star.classList.toggle("bi-star-fill", j < score);
                    star.classList.toggle("bi-star", j >= score);
                });

                // Update the input value with the selected score
                input.value = score;
            });
        });

        // Add click event listener to the input itself
        input.addEventListener("click", () => {
            const targetScoreIcons =
                input.previousElementSibling.querySelectorAll("i");
            const targetScore = Number(input.value);

            // Constants for a full score of 5 stars
            const fullScore = 5;
            const fullStar = Math.round(targetScore);

            // Update the visual representation of stars based on the input value
            targetScoreIcons.forEach((icon, i) => {
                icon.classList.toggle("bi-star-fill", i < fullStar);
                icon.classList.toggle("bi-star", i >= fullStar);
            });
        });
    });
}

// Creates score object: scoreId as keys and score as value
function createScoreObj() {
    const resultObj = {};
    scoresInputs.forEach((score) => {
        const scoreId = score.id;
        if (!(scoreId in resultObj)) {
            resultObj[scoreId] = score.value;
        }
    });
    return resultObj;
}

// Validate Score inputs
function validateScores(obj) {
    const keys = Object.keys(obj);
    let isValid = true;
    // Foe each box, if score is falsy value, return false
    keys.forEach((key) => {
        if (!obj[key]) {
            isValid = false;
            return isValid;
        }
    });
    // if all are not falsy value, return true
    return isValid;
}

// Display warning message on page if necessary
function makeWarningToInvalidScoreBox(obj) {
    const keys = Object.keys(obj);

    // Iterate through each key
    keys.forEach((key) => {
        // Get corresponding element based on key
        const targetEl = document.querySelector(`#${key}`).parentElement;
        const targetElParent = targetEl.parentElement;

        // Create warning message element
        const warningEl = document.createElement("p");
        warningEl.classList.add("warning-msg", "score-warning-msg");
        warningEl.textContent = "Please rate this section.";
        const targetElWarningMsgEl =
            targetElParent.querySelector(".score-warning-msg");

        // Check if the score is invalid (false)
        if (!obj[key]) {
            // If no warning message exists, insert the new warning element before the target element
            if (targetElWarningMsgEl == null) {
                targetElParent.insertBefore(warningEl, targetEl);
            }
            // Add a border class to highlight the target element as having an invalid score
            targetEl.classList.add("border-danger");
        } else {
            // If score is valid
            // If a warning message exists, remove it
            if (targetElWarningMsgEl) {
                targetElWarningMsgEl.remove();
            }
            // Remove the border class, indicating a valid score
            targetEl.classList.remove("border-danger");
        }
    });
}

// Creates checkBox array: contains all selected value
function createCheckBoxObj() {
    const selectors = document.querySelectorAll('input[type="checkbox"]');
    const resultObj = [];
    selectors.forEach((selector) => {
        if (selector.checked) {
            resultObj.push(selector.value);
        }
    });
    return resultObj;
}

// Validates each checkbox
function validateCheckBox() {
    // Get all checkboxes
    const selectors = document.querySelectorAll('input[type="checkbox"]');
    let tagCount = 0;

    // If box is checked, update tagCount
    selectors.forEach((selector) => {
        if (selector.checked) {
            tagCount++;
        }
    });

    // Check if 2 <= tagCount <= 5
    if (tagCount >= 2 && tagCount <= 5) {
        return true;
    } else {
        return false;
    }
}

// Display warning message on page if necessary
function makeWarningToInvalidTagBox(obj) {
    const container = document.querySelector("#form-tags-box > div");
    const msg = document.querySelector("#form-tags-box > p");
    // Display warning message when tagCount is not valid
    // Delete warning message when tagCount is valid
    if (obj.length <= 5 && obj.length >= 2) {
        container.classList.remove("border-danger");
        msg.classList.remove("warning-msg", "tags-warning-msg");
    } else {
        container.classList.add("border-danger");
        msg.classList.add("warning-msg", "tags-warning-msg");
    }
}

// Validate Comment
function validateComment() {
    const comment = document
        .querySelector("#form-comment-box textarea")
        .value.trim();
    // Check if the trimmed comment is falsy or not
    if (comment) {
        return true;
    } else {
        return false;
    }
}

// Display warning message on page if necessary
function makeWarningToCommentBox(isValid) {
    const targetEl = document.querySelector("#form-comment-box textarea");
    const warningEl = document.createElement("p");
    const targetElParent = targetEl.parentElement;
    warningEl.classList.add("warning-msg", "comment-warning-msg");
    warningEl.textContent = "Please leave your comment here.";
    const targetElWarningMsgEl = targetElParent.querySelector(
        ".comment-warning-msg"
    );
    if (isValid) {
        if (targetElWarningMsgEl) {
            targetElWarningMsgEl.remove();
        }
        targetEl.classList.remove("border-danger");
    } else {
        if (targetElWarningMsgEl == null) {
            targetElParent.insertBefore(warningEl, targetEl);
        }
        targetEl.classList.add("border", "border-danger");
    }
}

// Formatting tags array to store firestore
function formatTag(str) {
    words = str.split("-");
    // Capitalize the first letter of each word
    const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
    );

    // Join the words to form a sentence
    const finalTag = capitalizedWords.join(" ");

    return finalTag;
}

// Calculate average score of each score from score object
function calcAverageFromObj(obj) {
    const lst = Object.values(obj);
    let total = 0;
    lst.forEach((number) => {
        total += number;
    });
    return total / lst.length;
}

async function updatePropertyScore(newScore, propertyId) {
    // Get a reference to the Properties collection and the specific document
    const propertyRef = db.collection("Properties").doc(propertyId);

    try {
        // Start a transaction to ensure data consistency
        await db.runTransaction(async (transaction) => {
            // Get the current property document
            const propertyDoc = await transaction.get(propertyRef);

            if (!propertyDoc.exists) {
                throw "Document does not exist!";
            }

            // Compute the new overall score
            const propertyData = propertyDoc.data();
            const currentOverallScore = propertyData.overallScore || 0;
            const currentReviewCount = propertyData.reviewCount || 0;
            const newOverallScore = currentOverallScore + newScore;

            // Update the document with the new score and incremented review count
            transaction.update(propertyRef, {
                overallScore: newOverallScore,
                reviewCount: currentReviewCount + 1,
            });
        });

        console.log("Property score and review count updated successfully");
    } catch (error) {
        console.error("Transaction failed: ", error);
    }
}

// Gather form data from the review submission form
function getFormData() {
    // Initialize the result object with default values and the current user's ID
    const resultObj = {
        userId: currentUserID,
        eachScore: {
            cleanliness: 0,
            houserule: 0,
            landlord: 0,
            location: 0,
            price: 0,
        },
        overallScore: 0,
        tags: [],
        review: "",
        propertyId: "",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        voteCount: 0,
    };

    // Remove any stored user UID from the local storage
    window.localStorage.removeItem("userUID");

    // Calculate the total score and populate the eachScore object
    let total = 0;
    scoresInputs.forEach((score) => {
        const key = score.id.split("-")[0];
        resultObj["eachScore"][key] = Number(score.value);
        total += Number(score.value);
    });

    // Calculate and set the overall score based on the total
    resultObj["overallScore"] = total / 5;
    tags.forEach((tag) => {
        const targetInput = tag.previousElementSibling;
        if (targetInput.checked) {
            if (targetInput.value !== "none") {
                const formattedTag = formatTag(targetInput.value);
                resultObj["tags"].push(formattedTag);
            }
        }
    });

    // Get the review text and trim leading/trailing whitespaces
    resultObj["review"] = document
        .querySelector("#form-comment-box textarea")
        .value.trim();

    // Get the property ID from the URL parameters and set it in the result object
    const urlParams = new URL(location.href).searchParams;
    resultObj["propertyId"] = urlParams.get("propertyId");
    return resultObj;
}

// Store review data to firestore, and redirect to thank you page
function storeReviewFormDataToFirestore(resultObj, propertyId) {
    document.querySelector('button[type="submit"]').disabled = true;
    var reviewRef = db.collection("Reviews");
    reviewRef.add(resultObj).then((_) => {
        window.location.href = `./thankyou.html?propertyId=${propertyId}`;
    });
}

// Perform validation for the entire form
function validateForm(e) {
    // Get all the form data object and validation result
    const scoreBoxObj = createScoreObj();
    const tagsCheckedObj = createCheckBoxObj();
    const isValidScores = validateScores(scoreBoxObj);
    const isValidCheckBox = validateCheckBox(tagsCheckedObj);
    const isValidComment = validateComment();
    const allValid = isValidCheckBox && isValidComment && isValidScores;

    // When all are valid
    if (allValid) {
        // Update property score and store review data to firestore
        e.preventDefault();
        const formData = getFormData();
        updatePropertyScore(formData.overallScore, formData.propertyId);
        storeReviewFormDataToFirestore(formData, formData.propertyId);
    } else {
        // If not valid, execute functions to display warning messages
        e.preventDefault();
        makeWarningToInvalidScoreBox(scoreBoxObj);
        makeWarningToInvalidTagBox(tagsCheckedObj);
        makeWarningToCommentBox(isValidComment);
    }
}

// Invoke functions to initialize page
function initializeReviewPage() {
    initializeCheckBox();
    initializeScoresBox();
}

// Invoke functions to initiate events
function initiateEvent() {
    handleTagBoxClickEvent();
    handlePaintingStars();
    submitButton.addEventListener("click", validateForm);
}

// Add event listener for go back button so that user can access previous page
function initializeBackButton() {
    $("#go-back").on("click", function (e) {
        e.preventDefault();
        var propertyId = new URLSearchParams(window.location.search).get(
            "propertyId"
        );
        window.location.replace(`../details.html?propertyId=${propertyId}`);
    });
}

// Invoke all necessary functions
initializeBackButton();
initiateEvent();
initializeReviewPage();
