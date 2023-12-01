const tags = document.querySelector("#form-tags-box").querySelectorAll("label");
const submitButton = document.querySelector("#review-submit-box button");

let currentUserID;

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

function handleTagBoxClickEvent() {
    tags.forEach((tag) => {
        tag.addEventListener("click", (e) => {
            tag.classList.toggle("checked");
        });
    });
}

function initializeScoresBox() {
    scoresInputs.forEach((score) => {
        score.value = "";
    });
}

function initializeCheckBox() {
    const tagInputs = document
        .querySelector("#form-tags-box")
        .querySelectorAll("input");
    tagInputs.forEach((tag) => {
        tag.checked = false;
    });
}

function handlePaintingStars() {
    scoresInputs.forEach((input) => {
        const icons = input.previousElementSibling.querySelectorAll("i");
        for (let i = 0; i < icons.length; i++) {
            icons[i].addEventListener("click", (e) => {
                const score = i + 1;
                for (let j = 0; j < icons.length; j++) {
                    if (j < score) {
                        icons[j].classList.add("bi-star-fill");
                        icons[j].classList.remove("bi-star");
                    } else {
                        icons[j].classList.remove("bi-star-fill");
                        icons[j].classList.add("bi-star");
                    }
                }
                input.value = score;
            });
        }

        input.addEventListener("click", (e) => {
            const targetScoreIcon =
                e.target.previousElementSibling.querySelectorAll("i");
            const targetScore = Number(e.target.value);

            const fullScore = 5;
            const fullStar = parseInt(targetScore);
            const halfStar = targetScore % 1;
            // initialize icon
            targetScoreIcon.forEach((icon) => {
                icon.classList.remove(
                    "bi-star-fill",
                    "bi-star-half",
                    "bi-star"
                );
                icon.classList.add("bi-star");
            });
            // fill icon
            for (let i = 0; i < fullStar; i++) {
                targetScoreIcon[i].classList.add("bi-star-fill");
                targetScoreIcon[i].classList.remove("bi-star", "bi-star-half");
            }

            if (halfStar !== 0) {
                targetScoreIcon[fullStar].classList.add("bi-star-half");
                targetScoreIcon[fullStar].classList.remove(
                    "bi-star-fill",
                    "bi-star"
                );
            }
            for (let i = fullStar + 1; i < 5; i++) {
                targetScoreIcon[i].classList.remove(
                    "bi-star-fill",
                    "bi-star-half"
                );
                targetScoreIcon[i].classList.add("bi-star");
            }
        });
    });
}

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

function validateScores(obj) {
    const keys = Object.keys(obj);
    let isValid = true;
    keys.forEach((key) => {
        if (!obj[key]) {
            isValid = false;
            return isValid;
        }
    });
    return isValid;
}

function makeWarningToInvalidScoreBox(obj) {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
        const targetEl = document.querySelector(`#${key}`).parentElement;
        const targetElParent = targetEl.parentElement;
        const warningEl = document.createElement("p");
        warningEl.classList.add("warning-msg", "score-warning-msg");
        warningEl.textContent = "Please rate this section.";
        const targetElWarningMsgEl =
            targetElParent.querySelector(".score-warning-msg");
        if (!obj[key]) {
            if (targetElWarningMsgEl == null) {
                targetElParent.insertBefore(warningEl, targetEl);
            }
            targetEl.classList.add("border-danger");
        } else {
            if (targetElWarningMsgEl) {
                targetElWarningMsgEl.remove();
            }
            targetEl.classList.remove("border-danger");
        }
    });
}

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

function validateCheckBox() {
    const selectors = document.querySelectorAll('input[type="checkbox"]');
    let tagCount = 0;
    selectors.forEach((selector) => {
        if (selector.checked) {
            tagCount++;
        }
    });
    if (tagCount >= 2 && tagCount <= 5) {
        return true;
    } else {
        return false;
    }
}

function makeWarningToInvalidTagBox(obj) {
    const container = document.querySelector("#form-tags-box > div");
    const msg = document.querySelector("#form-tags-box > p");
    if (obj.length <= 5 && obj.length >= 2) {
        container.classList.remove("border-danger");
        msg.classList.remove("warning-msg", "tags-warning-msg");
    } else {
        container.classList.add("border-danger");
        msg.classList.add("warning-msg", "tags-warning-msg");
    }
}

function validateComment() {
    const comment = document
        .querySelector("#form-comment-box textarea")
        .value.trim();
    if (comment) {
        return true;
    } else {
        return false;
    }
}

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

function getFormData() {
    const resultObj = {
        // needs to be changed sometime later
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
    window.localStorage.removeItem("userUID");
    let total = 0;
    scoresInputs.forEach((score) => {
        const key = score.id.split("-")[0];
        resultObj["eachScore"][key] = Number(score.value);
        total += Number(score.value);
    });
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
    resultObj["review"] = document
        .querySelector("#form-comment-box textarea")
        .value.trim();

    const urlParams = new URL(location.href).searchParams;
    resultObj["propertyId"] = urlParams.get("propertyId");
    return resultObj;
}

function storeReviewFormDataToFirestore(resultObj) {
    document.querySelector('button[type="submit"]').disabled = true;
    var reviewRef = db.collection("Reviews");
    reviewRef.add(resultObj).then((_) => {
        window.location.href = "./thankyou.html";
    });
}

function validateForm(e) {
    const scoreBoxObj = createScoreObj();
    const tagsCheckedObj = createCheckBoxObj();
    const isValidScores = validateScores(scoreBoxObj);
    const isValidCheckBox = validateCheckBox(tagsCheckedObj);
    const isValidComment = validateComment();
    const allValid = isValidCheckBox && isValidComment && isValidScores;
    if (allValid) {
        e.preventDefault();
        const formData = getFormData();
        updatePropertyScore(formData.overallScore, formData.propertyId);
        var propertyId = new URLSearchParams(window.location.search).get(
            "propertyId"
        );
        window.localStorage.setItem("propertyId", propertyId);
        storeReviewFormDataToFirestore(formData);
    } else {
        e.preventDefault();
        makeWarningToInvalidScoreBox(scoreBoxObj);
        makeWarningToInvalidTagBox(tagsCheckedObj);
        makeWarningToCommentBox(isValidComment);
    }
}

// function initializeStoreColor() {
//     const boxes = document.querySelectorAll(".score-icon div");
//     boxes.forEach((box) => {
//         box.addEventListener("click", (e) => {
//             e.target.classList.remove("colored");
//         });
//     });
// }
// function colorScore() {
//     const boxes = document.querySelectorAll(".score-icon div");
//     const scoreBoard = {
//         point_five: 0.5,
//         one: 1,
//         one_point_five: 1.5,
//         two: 2,
//         two_point_five: 2.5,
//         three: 3,
//         three_point_five: 3.5,
//         four: 4,
//         four_point_five: 4.5,
//         five: 5,
//     };
//     for (let i = 0; i < boxes.length; i++) {
//         boxes[i].addEventListener("click", (e) => {
//             const scoreKey = e.target.id;
//             const span = e.target
//                 .closest(".each-score-outer-container")
//                 .querySelector("span");
//             for (let j = 0; j < boxes.length; j++) {
//                 if (j <= i) {
//                     boxes[j].classList.add("colored");
//                 } else {
//                     boxes[j].classList.remove("colored");
//                 }
//             }
//             span.textContent = scoreBoard[scoreKey].toFixed(1);
//         });
//     }
// }
// colorScore();
function initializeReviewPage() {
    initializeCheckBox();
    initializeScoresBox();
}

function initiateEvent() {
    handleTagBoxClickEvent();
    handlePaintingStars();
    submitButton.addEventListener("click", validateForm);
}

function initializeBackButton() {
    $("#go-back").on("click", function (e) {
        e.preventDefault();
        var propertyId = new URLSearchParams(window.location.search).get(
            "propertyId"
        );
        window.location.replace(`../details.html?propertyId=${propertyId}`);
    });
}

initializeBackButton();
initiateEvent();
initializeReviewPage();
