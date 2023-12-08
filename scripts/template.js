// log out the current user using Firebase Authentication.
function logout() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            console.log("Logging out user");
            window.location.href = "./logout-confirm.html";
        })
        .catch((error) => {
            console.error("Error logging out:", error.message);
        });
}

// Perform a search and redirect to the listings page with the search query
const navPerformSearch = () => {
    const input = $("#nav-search-input").val().trim().replace(/\s+/g, " ");
    if (input) {
        const searchUrl = "listings.html?search=" + encodeURIComponent(input);
        window.location.href = searchUrl;
    }
};

// Handle serach input on Enter key press
const navSearchListing = () => {
    const searchInput = $("#nav-search-input");

    searchInput.on("keyup", function (e) {
        if (e.which === 13) {
            navPerformSearch();
            e.preventDefault();
        }
    });
};

// Initialize the navigation bar based on user authentication status
function initializeNav(user) {
    const isLoggedIn = !!user;
    const navbar = isLoggedIn ? "navbar_after_login" : "navbar_before_login";

    // Load the appropriate navigation bar HTML based on user authentication status
    $("#NAVBAR-PLACEHOLDER").load(`./components/${navbar}.html`, function () {
        if (isLoggedIn) {
            // Attach the logout function to the sign-out button if the user is logged in
            $("#sign-out-btn").on("click", logout);
        }
        // Toggle mobile menu visibility on hamburger icon click
        $(".header__icon")
            .eq(0)
            .on("click", function () {
                $("nav").toggleClass("mobile-hidden");
            });

        const $searchIcon = $(".header__icon").eq(1);
        const $searchInput = $(".header__search-bar > div");
        const $h1 = $("#nav-title");
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

        navSearchListing();

        if (user) {
            console.log(user.uid);
            console.log(user.displayName);
            currentUser = db.collection("Users").doc(user.uid);
            currentUser.get().then((userDoc) => {
                const userName = userDoc.data().userName;
                $("#username").text(userName);
            });
        }
    });
}

// Load the footer by loading its HTML
function initializeFooter() {
    $("#FOOTER-PLACEHOLDER").load("./components/footer.html");
}

// Load the navigation bar, footer, and user-specific content
function loadSkeleton() {
    firebase.auth().onAuthStateChanged((user) => {
        initializeNav(user);
        initializeFooter();
    });
}

loadSkeleton();
