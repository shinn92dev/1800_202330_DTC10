document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "./login.html";
        } else {
            const inputUnit = document.getElementById("inputUnit");
            const inputAddress = document.getElementById("inputAddress");
            const inputCity = document.getElementById("inputCity");
            const postalCodeInput = document.getElementById("inputPostalCode");
            const policyElement = document.getElementById("policy");
            const invalidCheck = document.getElementById("invalidCheck");
            const submitBtn = document.getElementById("submit-btn");
            let propertyArray = [];

            // Initialize Firestore listener
            db.collection("Properties").onSnapshot((snapshot) => {
                propertyArray = snapshot.docs.map(
                    (doc) => doc.data().propertyFullAddress
                );
            });

            // Validate Canadian Postal Code
            function isValidCanadianPostalCode(postalCode) {
                const regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
                return regex.test(postalCode);
            }

            function validateField(field, isValid) {
                field.classList.toggle("is-invalid", !isValid);
                field.classList.toggle("is-valid", isValid);
            }

            function validateCity() {
                const isValid =
                    inputCity.value.trim() !== "" &&
                    /^[a-zA-Z]+$/.test(inputCity.value.trim());
                validateField(inputCity, isValid);
                return isValid;
            }

            function validateAddress() {
                const isValid = inputAddress.value.trim() !== "";
                validateField(inputAddress, isValid);
                return isValid;
            }

            function validatePostalCode() {
                const isValid = isValidCanadianPostalCode(
                    postalCodeInput.value.trim()
                );
                validateField(postalCodeInput, isValid);
                return isValid;
            }

            function validateCheckbox() {
                const isValid = invalidCheck.checked;
                validateField(invalidCheck, isValid);
                return isValid;
            }

            function isAddressUnique() {
                const userInputAddress =
                    `${inputUnit.value} ${inputAddress.value}, ${inputCity.value}`.trim();
                return !propertyArray.includes(userInputAddress);
            }

            function validateAddressUnique() {
                const isValid = isAddressUnique();
                validateAddress();

                const warningMsg = document.getElementById("warning-msg");
                if (!isValid) {
                    warningMsg.textContent = "Address already exists";
                } else {
                    warningMsg.textContent = "";
                }

                return isValid;
            }

            function formatAddress(unit, street, city) {
                const abbreviations = {
                    St: "Street",
                    Ave: "Avenue",
                    Dr: "Drive",
                    Blvd: "Boulevard",
                    Rd: "Road",
                    // Add other abbreviations here
                };

                let number, streetName;

                // Check if street starts with two numbers separated by a hyphen
                const match = street.match(/^(\d+)-(\d+)(.+)/);
                if (match) {
                    // If it does, treat the first number as the unit number
                    [, unit, number, streetName] = match;
                } else {
                    // If not, proceed as before
                    const match = street.match(/(\d+)(.+)/);
                    if (!match) {
                        return `${unit} ${street}, ${formatCity(city)}`;
                    }
                    [, number, streetName] = match;
                }

                const streetParts = streetName.trim().split(" ");
                const formattedStreetParts = streetParts.map((part) => {
                    const normalizedPart =
                        part.charAt(0).toUpperCase() +
                        part.slice(1).toLowerCase();
                    if (abbreviations[normalizedPart]) {
                        return abbreviations[normalizedPart];
                    }
                    return normalizedPart;
                });

                const formattedStreet = formattedStreetParts.join(" ");
                const formattedAddress = `${unit} ${number} ${formattedStreet}, ${formatCity(
                    city
                )}`;

                return formattedAddress;
            }

            function formatCity(city) {
                const words = city.split(" ");
                const formattedWords = words.map((word) => {
                    return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    );
                });
                return formattedWords.join(" ");
            }

            function formatPostalCode(postalCode) {
                const cleanedCode = postalCode
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, " ");
                const firstPart = cleanedCode.slice(0, 3);
                const lastPart = cleanedCode.slice(-3);
                return (firstPart + " " + lastPart).toUpperCase();
            }

            function validateInput() {
                const isCityValid = validateCity();
                const isAddressValid = validateAddress();
                const isPostalValid = validatePostalCode();
                const isUniqueAddress = validateAddressUnique();
                const isCheckValid = validateCheckbox();

                const allValid =
                    isCityValid &&
                    isAddressValid &&
                    isPostalValid &&
                    isCheckValid &&
                    isUniqueAddress;

                submitBtn.disabled = !allValid;

                if (allValid && isUniqueAddress) {
                    const userPostalCode = formatPostalCode(
                        postalCodeInput.value.trim()
                    );
                    const formattedUnit = inputUnit.value.trim();
                    const formattedStreet = inputAddress.value.trim();
                    const formattedCity = formatCity(inputCity.value.trim());
                    const userInputAddress = formatAddress(
                        formattedUnit,
                        formattedStreet,
                        formattedCity
                    );
                    const newObject = {
                        eachStore: {},
                        overallScore: 0,
                        propertyFullAddress: userInputAddress,
                        postalCode: userPostalCode,
                        tags: [],
                    };
                    submitBtn.onclick = async function () {
                        try {
                            submitBtn.disabled = true;
                            const response = await db
                                .collection("Properties")
                                .add(newObject);
                            const newPropertyId = response.id;
                            window.location.href = `review.html?propertyId=${newPropertyId}`;
                        } catch (error) {
                            submitBtn.disabled = false;
                            console.error("Error adding document: ", error);
                        }
                    };
                }
            }

            [inputCity, inputAddress, postalCodeInput, inputUnit].forEach(
                (element) => {
                    element.addEventListener("input", () => {
                        validateInput();
                    });
                }
            );

            invalidCheck.addEventListener("change", validateInput);
            document
                .getElementById("needs-validation")
                .addEventListener("submit", function (event) {
                    event.preventDefault();
                    validateInput();
                });

            // enable check box when policy is scrolled until the bottom
            let isScrolledToEnd = false;

            policyElement.addEventListener("scroll", function () {
                if (
                    !isScrolledToEnd &&
                    policyElement.scrollHeight -
                        policyElement.scrollTop -
                        policyElement.clientHeight <
                        1
                ) {
                    invalidCheck.disabled = false;
                    isScrolledToEnd = true;
                }
            });
        }
    });
});
