const navIcon = document.querySelectorAll(".header__icon")[0];
const nav = document.querySelector("nav");
navIcon.addEventListener("click", function () {
    nav.classList.toggle("mobile-hidden");
});
