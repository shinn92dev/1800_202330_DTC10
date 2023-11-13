const tags = document.querySelector("#form-tags-box").querySelectorAll("label");

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
initializeCheckBox();
