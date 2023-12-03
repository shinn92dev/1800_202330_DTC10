//----------------------------------------------------------
// Central function that orchestrates authentication and page update.
//----------------------------------------------------------
let currentUser;

function doAll() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = db.collection("Users").doc(user.uid);
            updatePageWithUserData();
        } else {
            window.location.href = "login.html";
        }
    });
}

function updatePageWithUserData() {
    currentUser.get().then((userDoc) => {
        const userData = userDoc.data();
        document.getElementById("name-goes-here").textContent =
            userData.userName;
        displayBookmarkData(userData.bookmarks);
    });
}

function displayBookmarkData(bookmarkIds) {
    const ul = $("#bookmarks");

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

function updateBookmark(docID) {
    currentUser.get().then((userDoc) => {
        const bookmarks = userDoc.data().bookmarks;
        const isBookmarked = bookmarks.includes(docID);
        const iconID = `save-${docID}`;
        const firestoreFieldValue = firebase.firestore.FieldValue;

        currentUser
            .update({
                bookmarks: isBookmarked
                    ? firestoreFieldValue.arrayRemove(docID)
                    : firestoreFieldValue.arrayUnion(docID),
            })
            .then(() => {
                document.getElementById(iconID).innerText = isBookmarked
                    ? "bookmark_border"
                    : "bookmark";
            });
    });
}

function generateNoResultsMessage() {
    return '<div class="listings_message listing_no_listings"><p class="listings_message-p">You have not added any bookmarks...</p><a class="go-back" href="../index.html">Go back to main page</div>';
}

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
            </a>
            <div class="d-flex justify-content-between align-items-center text-box__top">
                <i id="save-${propertyID}" style="cursor: pointer;" class="material-icons">bookmark</i>
            </div>
        </li>
    `;
}

doAll();
