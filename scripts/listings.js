let currentUser;

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

function getListingDataAndDisplay() {
    $(document).ready(function () {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const searchParam = urlParams.get("search")?.trim();
        const ul = $("#property-ul");

        if (!searchParam) {
            const noResultsMessage = generateNoResultsMessage();
            ul.append(noResultsMessage);
            return;
        }

        const matchingListingSet = new Set();

        const searchByAddress = db
            .collection("Properties")
            .where("propertyFullAddress", ">=", searchParam)
            .where("propertyFullAddress", "<=", searchParam + "\uf8ff")
            .get();

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
                            saveButton.on("click", () =>
                                updateBookmark(doc.id)
                            );

                            currentUser.get().then((userDoc) => {
                                const bookmarks = userDoc.data().bookmarks;
                                if (bookmarks.includes(doc.id)) {
                                    document.getElementById(
                                        "save-" + doc.id
                                    ).innerText = "bookmark";
                                }
                            });
                        }
                    });
                });

                if (noResults) {
                    const noResultsMessage = generateNoResultsMessage(true);
                    ul.append(noResultsMessage);
                }
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
    });
}

function updateBookmark(docID) {
    currentUser.get().then((userDoc) => {
        console.log("userDoc: ", userDoc.data());
        const bookmarks = userDoc.data().bookmarks;
        const isBookmarked = bookmarks.includes(docID);
        const iconID = "save-" + docID;
        const firestoreFieldValue = firebase.firestore.FieldValue;

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

getListingDataAndDisplay();
