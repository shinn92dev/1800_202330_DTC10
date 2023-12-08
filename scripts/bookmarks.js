//----------------------------------------------------------
// Central function that orchestrates authentication and page update.
//----------------------------------------------------------
let currentUser;

// Perform all the features
function doAll() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // If user is logged in, set the currentUser variable and update the page
            currentUser = db.collection("Users").doc(user.uid);
            updatePageWithUserData();
        } else {
            // If user is not logged in, redirect to the login page
            window.location.href = "login.html";
        }
    });
}

// Update the page with user-specific data
function updatePageWithUserData() {
    currentUser.get().then((userDoc) => {
        const userData = userDoc.data();
        // Display user name on the page
        document.getElementById("name-goes-here").textContent =
            userData.userName;
        // Display bookmark data on the page by invoking displayBookmarkData function
        displayBookmarkData(userData.bookmarks);
    });
}

// Display bookmarked property data on the page
function displayBookmarkData(bookmarkIds) {
    const ul = $("#bookmarks");

    // Display a message if there are no bookmarks
    if (!bookmarkIds.length) {
        ul.append(generateNoResultsMessage());
        return;
    }

    // Clear existing bookmarks before appending new ones
    ul.empty();

    // Fetch each bookmarked property details
    const propertiesCollection = db.collection("Properties");
    bookmarkIds.forEach((bookmarkId) => {
        propertiesCollection
            .doc(bookmarkId)
            .get()
            .then((doc) => {
                const propertyData = doc.data();

                // Generate and append a listing item for each bookmarked property
                ul.append(
                    generateListingItem({
                        ...propertyData,
                        propertyID: doc.id,
                    })
                );
                const saveButton = $(`#save-${doc.id}`);
                saveButton.on("click", () => updateBookmark(doc.id));
            })
            .catch((error) => {
                console.error("Error getting document:", error);
            });
    });
}

// Update the bookmark status for a property
function updateBookmark(docID) {
    currentUser.get().then((userDoc) => {
        const bookmarks = userDoc.data().bookmarks;
        const isBookmarked = bookmarks.includes(docID);
        const iconID = `save-${docID}`;
        const firestoreFieldValue = firebase.firestore.FieldValue;

        // Update the user's bookmarks based on the current bookmark status
        currentUser
            .update({
                bookmarks: isBookmarked
                    ? firestoreFieldValue.arrayRemove(docID)
                    : firestoreFieldValue.arrayUnion(docID),
            })
            .then(() => {
                // Update the bookmark icon based on the new bookmark status
                document.getElementById(iconID).innerText = isBookmarked
                    ? "bookmark_border"
                    : "bookmark";
            });
    });
}

// Generate a message when there are no bookmarks
function generateNoResultsMessage() {
    return '<div class="listings_message listing_no_listings"><p class="listings_message-p">You have not added any bookmarks...</p><a class="go-back" href="../index.html">Go back to main page</div>';
}

// Generate a listing item HTML for a bookmarked property
function generateListingItem(listing) {
    const tags = listing.tags.map((tag) => `<p>${tag}</p>`).join("");
    const address =
        listing.propertyFullAddress.replace(/_/g, " ") +
        ", " +
        listing.postalCode;
    const propertyID = listing.propertyID;
    const calculatedScore =
        listing.reviewCount !== 0
            ? listing.overallScore / listing.reviewCount
            : 0;

    return `
        <li class="bookmark-cards d-flex justify-content-between align-items-center property-card">
            <a href="/details.html?propertyId=${propertyID}" class="d-flex flex-grow-1 justify-content-between align-items-center">
                <div class="property-card__score-box">
                    <div class="d-flex justify-content-center align-items-center">${calculatedScore.toFixed(
                        1
                    )}</div>
                </div>
                <div class="property-card__text-box d-flex flex-column flex-grow-1">
                    <div class="text-box__middle"><h3 class="card-address">${address}</h3></div>
                    <div class="text-box__bottom d-flex justify-content-around">${tags}</div>
                </div>
            </a>0
            <div class="d-flex justify-content-between align-items-center text-box__top">
                <i id="save-${propertyID}" style="cursor: pointer;" class="material-icons">bookmark</i>
            </div>
        </li>
    `;
}

doAll();
