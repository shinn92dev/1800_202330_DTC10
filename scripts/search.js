function searchBarLogic() {
    const navIcon = document.querySelectorAll(".header__icon")[0];
    const nav = document.querySelector("nav");
    navIcon.addEventListener("click", function () {
        nav.classList.toggle("mobile-hidden");
    });

    const searchIcon = document.querySelectorAll(".header__icon")[1];
    const searchInput = document.querySelector(".header__search-bar > div");
    const h1 = document.querySelector("h1");
    const closeIcon = document.querySelector(".close__icon");
    const searchBar = document.querySelector(".header__search-bar");

    searchIcon.addEventListener("click", function () {
        searchInput.classList.toggle("mobile-hidden");
        h1.classList.toggle("mobile-hidden");
        searchIcon.classList.toggle("mobile-hidden");
        closeIcon.classList.toggle("mobile-hidden");
        searchBar.classList.toggle("search-box");
    });

    closeIcon.addEventListener("click", function () {
        searchInput.classList.toggle("mobile-hidden");
        h1.classList.toggle("mobile-hidden");
        searchIcon.classList.toggle("mobile-hidden");
        closeIcon.classList.toggle("mobile-hidden");
        searchBar.classList.toggle("search-box");
    });

    if (user) {
        console.log(user.uid); 
        console.log(user.displayName); 
        userName = user.displayName;
        document.getElementById("username").innerText = userName;  
    }
}

export { searchBarLogic };

