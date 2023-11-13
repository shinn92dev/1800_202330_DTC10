const performSearch = () => {
    const input = $("#search-input").val().trim().replace(/\s+/g, " ");
    const searchUrl = "listings.html?search=" + encodeURIComponent(input);
    window.location.href = searchUrl;
};

const searchListing = () => {
    $("#search-button").on("click", function () {
        performSearch();
    });

    $("#search-input").on("keypress", function (e) {
        if (e.which == 13) {
            performSearch();
            return false;
        }
    });
};

const initializeAfterAuth = (user) => {
    $("#welcome-banner").load(
        `./components/home_message_after.html`,
        function () {
            userName = user.displayName;
            $("#name-goes-here").text(userName);
        }
    );
};

const initializeBeforeAuth = () => {
    $("#welcome-banner").load("./components/home_message_before.html");
};

$(document).ready(function () {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            initializeAfterAuth(user);
        } else {
            initializeBeforeAuth();
        }
    });

    searchListing();
});
