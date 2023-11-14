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

function validateScores() {
    return false;
}
function validateForm(e) {
    const tagsCheckedObj = createCheckBoxObj();
    const isValidCheckBox = validateCheckBox(tagsCheckedObj);
    const isValidComment = validateComment();
    const isValidScores = validateScores();
    const allValid = isValidCheckBox && isValidComment && isValidScores;
    console.log(isValidCheckBox, isValidComment, isValidScores);
    console.log(allValid);
    if (allValid) {
    } else {
        e.preventDefault();
        // handle box validation
        makeWarningToInvalidTagBox(tagsCheckedObj);

        // handle comment validation
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
