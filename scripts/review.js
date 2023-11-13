const tags = document.querySelector("#form-tags-box").querySelectorAll("label");

tags.forEach((tag) => {
    tag.addEventListener("click", (el) => {
        tag.classList.toggle("checked");
    });
});
