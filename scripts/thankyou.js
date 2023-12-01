const propertyId = window.localStorage.getItem("PropertyId");
const link = document.querySelector(".thankyou-link");
link.href = `/details.html?propertyId=${propertyId}`;
window.localStorage.removeItem("propertyId");
