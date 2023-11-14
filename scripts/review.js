const tags = document.querySelector("#form-tags-box").querySelectorAll("label");
const submitButton = document.querySelector("#review-submit-box button");
const scoresInputs = document
    .querySelector("#form-stars-boxs")
    .querySelectorAll("input");

function handleTagBoxClickEvent() {
    tags.forEach((tag) => {
        tag.addEventListener("click", (el) => {
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
        if (!obj[key]) {
            document
                .querySelector(`#${key}`)
                .parentElement.classList.add("border-danger");
        } else {
            document
                .querySelector(`#${key}`)
                .parentElement.classList.remove("border-danger");
        }
    });
}

function createCheckBoxObj() {
    const tagsDivs = document.querySelectorAll("#form-tags-box > div");
    const resultObj = {};
    tagsDivs.forEach((div) => {
        const divId = div.id;
        if (!(divId in resultObj)) {
            resultObj[divId] = 0;
        }
        const taginputs = document
            .querySelector(`#${divId}`)
            .querySelectorAll("input");
        taginputs.forEach((input) => {
            if (input.checked) {
                resultObj[divId] += 1;
            }
        });
    });

    return resultObj;
}

function validateCheckBox(obj) {
    const idLst = Object.keys(obj);
    let isAllSelected = true;
    idLst.forEach((id) => {
        if (obj[id] <= 0) {
            isAllSelected = false;
            return false;
        }
    });
    return isAllSelected;
}

function makeWarningToInvalidTagBox(obj) {
    const idLst = Object.keys(obj);
    idLst.forEach((id) => {
        if (obj[id] == 0) {
            document
                .querySelector(`#${id} > div`)
                .classList.add("border-danger");
        } else {
            document
                .querySelector(`#${id} > div`)
                .classList.remove("border-danger");
        }
    });
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
    if (isValid) {
        document
            .querySelector("#form-comment-box textarea")
            .classList.remove("border-danger");
    } else {
        document
            .querySelector("#form-comment-box textarea")
            .classList.add("border");
        document
            .querySelector("#form-comment-box textarea")
            .classList.add("border-danger");
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
function getFormData() {
    const resultObj = { eachScore: [], tags: [], comment: "" };
    scoresInputs.forEach((score) => {
        resultObj["eachScore"].push(Number(score.value));
    });
    tags.forEach((tag) => {
        const targetInput = tag.previousElementSibling;
        if (targetInput.checked) {
            if (targetInput.value !== "none") {
                const formattedTag = formatTag(targetInput.value);
                resultObj["tags"].push(formattedTag);
            }
        }
    });
    resultObj["comment"] = document
        .querySelector("#form-comment-box textarea")
        .value.trim();
    console.log(resultObj);
}

function validateForm(e) {
    const scoreBoxObj = createScoreObj();
    const tagsCheckedObj = createCheckBoxObj();
    const isValidScores = validateScores(scoreBoxObj);
    const isValidCheckBox = validateCheckBox(tagsCheckedObj);
    const isValidComment = validateComment();
    const allValid = isValidCheckBox && isValidComment && isValidScores;
    console.log(isValidCheckBox, isValidComment, isValidScores);
    console.log(allValid);
    if (allValid) {
        e.preventDefault();
        getFormData();
    } else {
        e.preventDefault();
        makeWarningToInvalidScoreBox(scoreBoxObj);
        makeWarningToInvalidTagBox(tagsCheckedObj);
        makeWarningToCommentBox(isValidComment);
    }
}

function initializeReviewPage() {
    initializeCheckBox();
    initializeScoresBox();
}

function initiateEvent() {
    handleTagBoxClickEvent();
    handlePaintingStars();
    submitButton.addEventListener("click", validateForm);
}
initiateEvent();
initializeReviewPage();
