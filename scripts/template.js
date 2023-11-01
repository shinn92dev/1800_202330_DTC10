function logout() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            console.log("logging out user");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error logging out:", error.message);
        });
}

function initializeNav(user) {
    const isLoggedIn = !!user;
    const navbar = isLoggedIn ? `navbar_after_login` : `navbar_before_login`;
    $("#NAVBAR-PLACEHOLDER").load(`./components/${navbar}.html`, function () {
        if (isLoggedIn) {
            const logoutButton = document.getElementById("sign-out-btn");
            logoutButton.addEventListener("click", function () {
                logout();
            });
        }
        const navIcon = document.querySelectorAll(".header__icon")[0];
        const nav = document.querySelector("nav");
        navIcon.addEventListener("click", function () {
            nav.classList.toggle("mobile-hidden");
        });

        const searchIcon = document.querySelectorAll(".header__icon")[1];
        const searchInput = document.querySelector(".header__search-bar > div");
        const h1 = document.querySelector("h1");
        const closeIcon = document.querySelector(".close__icon");

        searchIcon.addEventListener("click", function () {
            searchInput.classList.toggle("mobile-hidden");
            h1.classList.toggle("mobile-hidden");
            searchIcon.classList.toggle("mobile-hidden");
            closeIcon.classList.toggle("mobile-hidden");
        });

        closeIcon.addEventListener("click", function () {
            searchInput.classList.toggle("mobile-hidden");
            h1.classList.toggle("mobile-hidden");
            searchIcon.classList.toggle("mobile-hidden");
            closeIcon.classList.toggle("mobile-hidden");
        });
    });
}

function initializeFooter() {
    $("#FOOTER-PLACEHOLDER").load("./components/footer.html");
}

function loadSkeleton() {
    firebase.auth().onAuthStateChanged((user) => {
        initializeNav(user);
        initializeFooter();
    });
}

loadSkeleton();
