import { navbarLogic } from "./nav";
import { searchLogic } from "./search";

function initializeNav() {
    $("#NAVBAR-PLACEHOLDER").load("./components/navbar.html", function () {
        navbarLogic();
    });
}

function initializeSearch() {
    $("#FOOTER-PLACEHOLDER").load("./components/footer.html", function () {
        searchLogic();
    });
}

function loadSkeleton() {
    initializeNav();
    initializeSearch();
}

loadSkeleton();
