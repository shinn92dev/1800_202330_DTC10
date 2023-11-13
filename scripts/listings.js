function getListingDataAndDisplay() {
    $(document).ready(function () {
        const matchingListingLst = [];

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const searchParam = urlParams.get("search").trim();

        const ul = $("#property-ul");

        db.collection("Properties")
            .where("propertyFullAddress", ">=", searchParam)
            .where("propertyFullAddress", "<=", searchParam + "\uf8ff")
            .where("postalCode", ">=", searchParam)
            .where("postalCode", "<=", searchParam + "\uf8ff")
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("No matching documents.");
                    const listItem = $(`<div class="listings_message">
                    <p class="listings_message-p">Seems like this property does not exist...</p>
                    <a href="./add-property.html" class="listings_message-a">Add this property & leave a review</a>
                </div>`);
                    ul.append(listItem);
                    return;
                }

                querySnapshot.forEach((doc) => {
                    matchingListingLst.push(doc.data());
                    console.log(doc.id, " => ", doc.data());
                });

                // Display data
                $.each(matchingListingLst, function (_, listing) {
                    // create html element variables
                    const listItem = $(
                        '<li class="property-card d-flex justify-content-between align-items-center"></li>'
                    );
                    const scoreBox = $(
                        '<div class="property-card__score-box"><div class="d-flex justify-content-center align-items-center"></div></div>'
                    );
                    scoreBox.find("div").text(listing.overallScore.toFixed(1));
                    console.log(scoreBox);
                    const textBox = $(
                        '<div class="property-card__text-box d-flex flex-column"></div>'
                    );
                    const topTextBox = $(
                        '<div class="d-flex justify-content-between align-items-center text-box__top"><h2></h2><img src="./images/bookmark.svg" alt="" /></div>'
                    );
                    topTextBox.find("h2").text(listing.type);
                    const middleTextBox = $(
                        '<div class="text-box__middle"><h3></h3></div>'
                    );
                    address =
                        listing.propertyFullAddress.replace(/_/g, " ") +
                        ", " +
                        listing.postalCode;
                    middleTextBox.find("h3").text(address);
                    const bottomTextBox = $(
                        '<div class="text-box__bottom d-flex justify-content-around"></div>'
                    );

                    tagLst = listing.tags;
                    tagLst.forEach((tag) => {
                        pTag = $("<p></p>");
                        pTag.text(tag);
                        bottomTextBox.append($(pTag));
                    });

                    textBox.append(topTextBox);
                    textBox.append(middleTextBox);
                    textBox.append(bottomTextBox);
                    listItem.append(scoreBox);
                    listItem.append(textBox);
                    console.log(listItem);
                    ul.append(listItem);
                });
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
            });
    });
}

getListingDataAndDisplay();

const rentalData = [
    {
        propertyFullAddress: "4567 Oak Avenue, Vancouver",
        postalCode: "V6K 2M3",
        eachScore: {
            cleanliness: 4,
            houserule: 3.5,
            price: 3.5,
            landlord: 4,
            location: 4,
        },
        overallScore: 3.9,
        tags: ["Clean", "Convenient Location"],
    },
    {
        propertyFullAddress: "7890 Birch Street, Vancouver",
        postalCode: "V6F 5U6",
        eachScore: {
            cleanliness: 3.5,
            houserule: 3,
            price: 4,
            landlord: 3.5,
            location: 3.5,
        },
        overallScore: 3.7,
        tags: ["Affordable", "Quiet"],
    },
    {
        propertyFullAddress: "1234 Elm Lane, Vancouver",
        postalCode: "V6B 3N2",
        eachScore: {
            cleanliness: 4.5,
            houserule: 4,
            price: 3.5,
            landlord: 4,
            location: 4.5,
        },
        overallScore: 4.2,
        tags: ["Clean", "Responsive Landlord", "Great Location"],
    },
    {
        propertyFullAddress: "5678 Pine Road, Vancouver",
        postalCode: "V6D 4S1",
        eachScore: {
            cleanliness: 3.5,
            houserule: 3,
            price: 4,
            landlord: 3,
            location: 3,
        },
        overallScore: 3.3,
        tags: ["Affordable"],
    },
    {
        propertyFullAddress: "9876 Cedar Avenue, Vancouver",
        postalCode: "V6J 0Z9",
        eachScore: {
            cleanliness: 4,
            houserule: 4.5,
            price: 3,
            landlord: 3.5,
            location: 4,
        },
        overallScore: 4,
        tags: ["Clean", "Responsive Landlord"],
    },
    {
        propertyFullAddress: "3456 Maple Street, Vancouver",
        postalCode: "V6H 6X5",
        eachScore: {
            cleanliness: 4.5,
            houserule: 4,
            price: 3.5,
            landlord: 4.5,
            location: 4,
        },
        overallScore: 4.3,
        tags: ["Clean", "Quiet"],
    },
    {
        propertyFullAddress: "6543 Fir Avenue, Vancouver",
        postalCode: "V6I 8Y8",
        eachScore: {
            cleanliness: 3.5,
            houserule: 3.5,
            price: 4.5,
            landlord: 3,
            location: 3.5,
        },
        overallScore: 3.7,
        tags: ["Affordable", "Convenient Location"],
    },
    {
        propertyFullAddress: "2345 Cedar Drive, Vancouver",
        postalCode: "V6G 7W7",
        eachScore: {
            cleanliness: 4.5,
            houserule: 4.5,
            price: 4,
            landlord: 4,
            location: 4.5,
        },
        overallScore: 4.6,
        tags: ["Clean", "Responsive Landlord", "Great Location"],
    },
    {
        propertyFullAddress: "8765 Birch Lane, Vancouver",
        postalCode: "V6F 4T4",
        eachScore: {
            cleanliness: 3,
            houserule: 3,
            price: 3.5,
            landlord: 3,
            location: 3,
        },
        overallScore: 3.1,
        tags: ["Affordable"],
    },
    {
        propertyFullAddress: "5432 Spruce Road, Vancouver",
        postalCode: "V6E 5U5",
        eachScore: {
            cleanliness: 4,
            houserule: 3.5,
            price: 4.5,
            landlord: 4,
            location: 4.5,
        },
        overallScore: 4.3,
        tags: ["Clean", "Convenient Location", "Quiet"],
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
