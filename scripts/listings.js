let currentUser;

// Handle modal logic for sign-up alert
function handleModalSignUpAlert() {
    const iconArr = document.querySelectorAll(".text-box__top i");
    const overlay = document.querySelector("#overlay");
    const modalBox = document.querySelector("#sign-up-alert");
    const cancelIcon = document.querySelector("#sign-up-alert button");
    const body = document.querySelector("body");

    // Add click event listeners to icons for showing the sign-up alert modal
    iconArr.forEach((icon) => {
        icon.addEventListener("click", (e) => {
            body.classList.add("modal_effect");
            window.scrollTo(0, 0);
            overlay.classList.remove("hidden");
            modalBox.classList.remove("hidden");
        });
    });

    // Add click event listener to the cancel icon for hiding the sign-up alert modal
    cancelIcon.addEventListener("click", (e) => {
        overlay.classList.add("hidden");
        modalBox.classList.add("hidden");
        body.classList.remove("modal_effect");
    });

    // Add keyup event listener to handle escape and enter key presses
    document.addEventListener("keyup", (e) => {
        if (!overlay.classList.contains("hidden")) {
            if (e.key == "Escape") {
                overlay.classList.add("hidden");
                modalBox.classList.add("hidden");
                body.classList.remove("modal_effect");
            } else if (e.key == "Enter") {
                window.location.href = "./login.html";
            }
        }
    });
}

// Get user authentication state
const getUser = () => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = db.collection("Users").doc(user.uid);
        } else {
            console.log("No user is signed in");
        }
    });
};

getUser();

// Get listing data and display based on search parameters
function getListingDataAndDisplay() {
    $(document).ready(function () {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const searchParam = urlParams.get("search")?.trim();
        const ul = $("#property-ul");

        // If there is no search parameter, display a message and return
        if (!searchParam) {
            const noResultsMessage = generateNoResultsMessage();
            ul.append(noResultsMessage);
            return;
        }

        const matchingListingSet = new Set();

        // Perform search by address
        const searchByAddress = db
            .collection("Properties")
            .where("propertyFullAddress", ">=", searchParam)
            .where("propertyFullAddress", "<=", searchParam + "\uf8ff")
            .get();

        // Perform search by postal code
        const searchByPostalCode = db
            .collection("Properties")
            .where("postalCode", ">=", searchParam)
            .where("postalCode", "<=", searchParam + "\uf8ff")
            .get();

        Promise.all([searchByAddress, searchByPostalCode])
            .then((results) => {
                let noResults = true;

                results.forEach((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data();
                        docData["propertyID"] = doc.id;
                        if (!matchingListingSet.has(doc.id)) {
                            matchingListingSet.add(doc.id);
                            const listingItem = generateListingItem(docData);
                            ul.append(listingItem);
                            noResults = false;

                            const saveButton = $(`#save-${doc.id}`);
                            // Check user authentication state and handle bookmark logic
                            firebase.auth().onAuthStateChanged((user) => {
                                if (user) {
                                    currentUser.get().then((userDoc) => {
                                        const bookmarks =
                                            userDoc.data().bookmarks;
                                        if (bookmarks.includes(doc.id)) {
                                            document.getElementById(
                                                "save-" + doc.id
                                            ).innerText = "bookmark";
                                        }
                                    });

                                    // Add click event listener for saving bookmark
                                    saveButton.on("click", () => {
                                        updateBookmark(doc.id);
                                    });
                                } else {
                                    // Display modal sign-up alert if user is not authenticated
                                    handleModalSignUpAlert();
                                }
                            });
                        }
                    });
                });

                // Display appropriate message if no results are found
                if (noResults) {
                    const noResultsMessage = generateNoResultsMessage(true);
                    ul.append(noResultsMessage);
                } else {
                    ul.append(generateNotFoundProperty());
                }
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
    });
}

// Update bookmark status for a property
function updateBookmark(docID) {
    currentUser.get().then((userDoc) => {
        const bookmarks = userDoc.data().bookmarks;
        const isBookmarked = bookmarks.includes(docID);
        const iconID = "save-" + docID;
        const firestoreFieldValue = firebase.firestore.FieldValue;

        // Update user's bookmarks in Firestore
        currentUser
            .update({
                bookmarks: isBookmarked
                    ? firestoreFieldValue.arrayRemove(docID)
                    : firestoreFieldValue.arrayUnion(docID),
            })
            .then(() => {
                console.log(
                    isBookmarked
                        ? "Item was removed from bookmarks: "
                        : "This item was added to bookmarks: ",
                    docID
                );
                document.getElementById(iconID).innerText = isBookmarked
                    ? "bookmark_border"
                    : "bookmark";
            });
    });
}

// Generate HTML for a property listing item
function generateListingItem(listing) {
    const tags = listing.tags.map((tag) => `<p>${tag}</p>`).join("");
    const address = `${listing.propertyFullAddress.replace(/_/g, " ")}, ${
        listing.postalCode
    }`;
    const propertyID = listing.propertyID;
    const calculatedScore =
        listing.reviewCount !== 0
            ? listing.overallScore / listing.reviewCount
            : 0;

    return `
        <li class="d-flex justify-content-between align-items-center property-card">
            <a href="/details.html?propertyId=${propertyID}" class="d-flex flex-grow-1 justify-content-between align-items-center">
                <div class="property-card__score-box">
                    <div class="d-flex justify-content-center align-items-center">
                        ${calculatedScore.toFixed(1)}
                    </div>
                </div>
                <div class="property-card__text-box d-flex flex-column flex-grow-1">
                    <div class="text-box__middle">
                        <h3>${address}</h3>
                    </div>
                    <div class="text-box__bottom d-flex justify-content-around">
                        ${tags}
                    </div>
                </div>
            </a>
            <div class="d-flex justify-content-between align-items-center text-box__top">
                <i id="save-${propertyID}" style="cursor: pointer;" class="material-icons">bookmark_border</i>
            </div>
        </li>
    `;
}

function generateNoResultsMessage(hasResults = false) {
    const message = hasResults
        ? "Seems like this property does not exist..."
        : "Nothing to search for...";
    const linkText = hasResults ? "Add a property" : "Go back";

    return `
        <div class="listings_message">
            <p class="listings_message-p">${message}</p>
            <a href="./${
                hasResults ? "add-property" : "index"
            }.html" class="listings_message-a"><button class=add-property-btn>${linkText}<button</a>
        </div>
    `;
}

function generateNotFoundProperty() {
    return `
        <div class="listings_message">
            <p style="text-align: center;" class="listings_message-p">If you cannot find the property you are looking for ...</p>
            <a href="./add-property.html" class="listings_message-a"><button class=add-property-btn>Add a Property</button></a>
        </div>
    `;
}

getListingDataAndDisplay();
