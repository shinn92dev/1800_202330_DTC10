// Redirect to "index.html" after a delay of 2000 milliseconds (2 seconds)
function redirectToIndex() {
    setTimeout(function () {
        window.location.href = "index.html";
    }, 2000);
}

redirectToIndex();
