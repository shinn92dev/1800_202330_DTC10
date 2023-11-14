const tags = document.querySelector("#form-tags-box").querySelectorAll("label");
const submitButton = document.querySelector("#review-submit-box button");
tags.forEach((tag) => {
    tag.addEventListener("click", (el) => {
        tag.classList.toggle("checked");
    });
});

function initializeCheckBox() {
    const tagInputs = document
        .querySelector("#form-tags-box")
        .querySelectorAll("input");
    tagInputs.forEach((tag) => {
        tag.checked = false;
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
        // const count = 0;
        taginputs.forEach((input) => {
            if (input.checked) {
                resultObj[divId] += 1;
            }
        });
    });

    return resultObj;
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
function validateForm(e) {
    e.preventDefault();
    // handle check box validation
    tagsCheckedObj = createCheckBoxObj();
    let allValid = false;
    const isValidCheckBox = validateCheckBox(tagsCheckedObj);
    makeWarningToInvalidTagBox(tagsCheckedObj);

    const isValidComment = validateComment();
    makeWarningToCommentBox(isValidComment);
}
initializeCheckBox();
submitButton.addEventListener("click", validateForm);
