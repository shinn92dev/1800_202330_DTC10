// Get propertyId from url, and set "propertyId" for a tag href attribute
const propertyId = new URL(location.href).searchParams.get("propertyId");
const link = document.querySelector(".thankyou-link");
link.href = `/details.html?propertyId=${propertyId}`;
