// Handle the search logic
const performSearch = () => {
    const input = $("#search-input").val().trim().replace(/\s+/g, " ");
    if (input) {
        const searchUrl = "listings.html?search=" + encodeURIComponent(input);
        window.location.href = searchUrl;
    }
};

// Manage search input and button behavior
const searchListing = () => {
    const searchInput = $("#search-input");
    const searchButton = $("#search-button");

    // Disable the search button initially (with no search keyword)
    searchButton.prop("disabled", true);

    // Enable/disable the search button based on input presence
    searchInput.on("input", function () {
        searchButton.prop("disabled", this.value.trim() === "");
    });

    // Handle search button click
    searchButton.on("click", function () {
        performSearch();
    });

    // Handle pressing Enter key in the search input
    searchInput.on("keyup", function (e) {
        if (e.which === 13) {
            performSearch();
            e.preventDefault();
        }
    });
};
// Initialize the UI after user authentication
const initializeAfterAuth = (user) => {
    $("#welcome-banner").load(
        `./components/home_message_after.html`,
        function () {
            currentUser = db.collection("Users").doc(user.uid);
            currentUser.get().then((userDoc) => {
                userName = userDoc.data().userName + "!";
                $("#name-goes-here").text(userName);
                $("#name-goes-here").append(
                    $(`<span id="hello-emoji">👋</span>`)
                );
            });
        }
    );
};

// Initialize the UI before user authentication
const initializeBeforeAuth = () => {
    $("#welcome-banner").load("./components/home_message_before.html");
};

const topListings = () => {};

$(document).ready(function () {
    // Listen for changes in user authentication state
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is logged in, initialize UI accordingly
            initializeAfterAuth(user);
        } else {
            // User is not logged in, initialize UI accordingly
            initializeBeforeAuth();
        }
    });

    // Set up search functionality
    searchListing();
});
