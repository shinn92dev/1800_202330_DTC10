import { navbarLogic } from "./nav";
import { searchBarLogic } from "./search";

function initializeNav(callback) {
    $("#NAVBAR-PLACEHOLDER").load("./components/navbar.html", function () {
        navbarLogic();
    });
}

function initializeSearch() {
    $("#FOOTER-PLACEHOLDER").load("./components/footer.html", function () {
        searchBarLogic();
    });
}

function loadSkeleton() {
    initializeNav();
    initializeSearch();
}

loadSkeleton();
