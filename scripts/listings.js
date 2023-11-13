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
                        if (!matchingListingSet.has(doc.id)) {
                            matchingListingSet.add(doc.id);
                            const listingItem = generateListingItem(docData);
                            ul.append(listingItem);
                            noResults = false;
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

function generateListingItem(listing) {
    const tags = listing.tags.map((tag) => `<p>${tag}</p>`).join("");
    const address = `${listing.propertyFullAddress.replace(/_/g, " ")}, ${
        listing.postalCode
    }`;

    return `
        <li class="property-card d-flex justify-content-between align-items-center">
            <div class="property-card__score-box">
                <div class="d-flex justify-content-center align-items-center">
                    ${listing.overallScore.toFixed(1)}
                </div>
            </div>
            <div class="property-card__text-box d-flex flex-column">
                <div class="text-box__middle">
                    <h3>${address}</h3>
                </div>
                <div class="text-box__bottom d-flex justify-content-around">
                    ${tags}
                </div>
            </div>
            <div class="d-flex justify-content-between align-items-center text-box__top">
                <img src="./images/bookmark.svg" alt="" />
            </div>
        </li>
    `;
}

function generateNoResultsMessage(hasResults = false) {
    const message = hasResults
        ? "Seems like this property does not exist..."
        : "Nothing to search for...";
    const linkText = hasResults
        ? "Add this property & leave a review"
        : "Go back";

    return `
        <div class="listings_message">
            <p class="listings_message-p">${message}</p>
            <a href="./${
                hasResults ? "add-property" : "index"
            }.html" class="listings_message-a">${linkText}</a>
        </div>
    `;
}

getListingDataAndDisplay();

const rentalData = [
    {
        propertyFullAddress: "555 Seymour St",
        postalCode: "V6B 3H6",
        eachScore: {
            cleanliness: 4,
            houserule: 3,
            price: 3,
            landlord: 4,
            location: 5,
        },
        overallScore: 3.8,
        tags: ["Clean", "Convenient Location"],
    },
];

// don't call this function unless you want to add more data
async function sendRentalDataToFirestore(rentalData) {
    const rentalsCollection = db.collection("Properties");

    for (const rental of rentalData) {
        await rentalsCollection
            .add(rental)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }
}
