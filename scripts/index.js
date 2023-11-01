function initializeAfterAuth(user) {
    $("#welcome-banner").load(
        `./components/home_message_after.html`,
        function () {
            userName = user.displayName;
            $("#name-goes-here").text(userName);
        }
    );
}

function initializeBeforeAuth() {
    $("#welcome-banner").load("./components/home_message_before.html");
}

function loadPage() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            initializeAfterAuth(user);
        } else {
            initializeBeforeAuth();
        }
    });
}

loadPage();
