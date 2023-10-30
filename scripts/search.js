function searchBarLogic() {
    const searchIcon = document.querySelectorAll(".header__icon")[1];
    const searchInput = document.querySelector(".header__search-bar > div");
    const h1 = document.querySelector("h1");
    const closeIcon = document.querySelector(".close__icon")

    searchIcon.addEventListener("click", function () {
        searchInput.classList.toggle("mobile-hidden");
        h1.classList.toggle("mobile-hidden");
        searchIcon.classList.toggle("mobile-hidden");
        closeIcon.classList.toggle("mobile-hidden")
    });

    closeIcon.addEventListener("click", function () {
        searchInput.classList.toggle("mobile-hidden");
        h1.classList.toggle("mobile-hidden");
        searchIcon.classList.toggle("mobile-hidden");
        closeIcon.classList.toggle("mobile-hidden");
    });
}

export { searchBarLogic };
