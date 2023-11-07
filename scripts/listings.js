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
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("No matching documents.");
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
