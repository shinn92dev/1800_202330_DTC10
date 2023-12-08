// Handle logic for the search bar, navigation bar, and user display
function searchBarLogic() {
    const navIcon = document.querySelectorAll(".header__icon")[0];
    const nav = document.querySelector("nav");

    // Toggle mobile menu visibility on hamburger icon click
    navIcon.addEventListener("click", function () {
        nav.classList.toggle("mobile-hidden");
    });

    const searchIcon = document.querySelectorAll(".header__icon")[1];
    const searchInput = document.querySelector(".header__search-bar > div");
    const h1 = document.querySelector("h1");
    const closeIcon = document.querySelector(".close__icon");
    const searchBar = document.querySelector(".header__search-bar");

    // Toggle mobile search bar visibility and styling on search icon click
    searchIcon.addEventListener("click", function () {
        searchInput.classList.toggle("mobile-hidden");
        h1.classList.toggle("mobile-hidden");
        searchIcon.classList.toggle("mobile-hidden");
        closeIcon.classList.toggle("mobile-hidden");
        searchBar.classList.toggle("search-box");
    });

    // Toggle mobile search bar visibility and styling on close icon click
    closeIcon.addEventListener("click", function () {
        searchInput.classList.toggle("mobile-hidden");
        h1.classList.toggle("mobile-hidden");
        searchIcon.classList.toggle("mobile-hidden");
        closeIcon.classList.toggle("mobile-hidden");
        searchBar.classList.toggle("search-box");
    });

    // Check if a user is authenticated and update the displayed username
    if (user) {
        console.log(user.uid);
        console.log(user.displayName);
        userName = user.displayName;
        document.getElementById("username").innerText = userName;
    }
}

export { searchBarLogic };
