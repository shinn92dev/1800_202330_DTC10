document.addEventListener("DOMContentLoaded", function () {
    // Listen for the custom event triggered by details.js
    console.log("DOM loaded");
    document.addEventListener("detailsLoaded", function () {
        console.log("Details.js loaded");
        const icons = document.querySelector("#review-vote-box");
        console.log(icons);
    });
});
