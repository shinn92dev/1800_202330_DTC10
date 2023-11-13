function logout() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            console.log("Logging out user");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error logging out:", error.message);
        });
}

const performSearch = () => {
    const input = $("#nav-search-input").val().trim().replace(/\s+/g, " ");
    if (input) {
        const searchUrl = "listings.html?search=" + encodeURIComponent(input);
        window.location.href = searchUrl;
    }
};

const searchListing = () => {
    const searchInput = $("#nav-search-input");

    searchInput.on("keypress", function (e) {
        if (e.which == 13) {
            performSearch();
            return false;
        }
    });
};

function initializeNav(user) {
    const isLoggedIn = !!user;
    const navbar = isLoggedIn ? "navbar_after_login" : "navbar_before_login";

    $("#NAVBAR-PLACEHOLDER").load(`./components/${navbar}.html`, function () {
        if (isLoggedIn) {
            $("#sign-out-btn").on("click", logout);
        }

        $(".header__icon")
            .eq(0)
            .on("click", function () {
                $("nav").toggleClass("mobile-hidden");
            });

        const $searchIcon = $(".header__icon").eq(1);
        const $searchInput = $(".header__search-bar > div");
        const $h1 = $("h1");
        const $closeIcon = $(".close__icon");
        const $searchBar = $(".header__search-bar");

        $searchIcon.on("click", function () {
            $searchInput.toggleClass("mobile-hidden");
            $h1.toggleClass("mobile-hidden");
            $searchIcon.toggleClass("mobile-hidden");
            $closeIcon.toggleClass("mobile-hidden");
            $searchBar.toggleClass("search-box");
        });

        $closeIcon.on("click", function () {
            $searchInput.toggleClass("mobile-hidden");
            $h1.toggleClass("mobile-hidden");
            $searchIcon.toggleClass("mobile-hidden");
            $closeIcon.toggleClass("mobile-hidden");
            $searchBar.toggleClass("search-box");
        });

        searchListing();

        if (user) {
            console.log(user.uid);
            console.log(user.displayName);
            $("#username").text(user.displayName);
        }
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
