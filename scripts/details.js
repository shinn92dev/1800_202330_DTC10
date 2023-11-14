function createRandomUsername(length) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomUsername = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomUsername += characters.charAt(randomIndex);
    }

    return randomUsername;
}

function getPropertyDataFromDBAndDisplay(propertyId) {
    // Getting only related document Id
    const reviewsCollection = db.collection("Reviews");
    const propertyIdLst = [];
    const commentsData = [];

    reviewsCollection
        .where("propertyId", "==", propertyId)
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapshot) => {
            // Create related Reviews collection document Id
            querySnapshot.forEach((doc) => {
                propertyIdLst.push(doc.id);
            });

            // Create commentsData list
            const promises = propertyIdLst.map((id) => {
                return reviewsCollection
                    .doc(id)
                    .get()
                    .then((docSnapshot) => {
                        if (docSnapshot.exists) {
                            const data = docSnapshot.data();
                            const date = data.createdAt.toDate();
                            const formattedDate = date.toLocaleDateString(
                                "en-US",
                                {
                                    year: "2-digit",
                                    month: "2-digit",
                                    day: "numeric", // Use any options you like
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            );
                            commentsData.push({
                                score: data.overallScore,
                                review: data.review,
                                tags: data.tags,
                                date: formattedDate,
                            });
                        }
                    });
            });

            // Wait for all queries to complete
            return Promise.all(promises);
        })
        .then((result) => {
            $(document).ready(function () {
                $.each(commentsData, function (_, comment) {
                    const listItem = $('<li class="my-3 p-3"></li>');

                    // User name
                    const username = "User " + createRandomUsername(5);
                    listItem.append($('<h3 class="mb-3"></h3>').text(username));

                    // date
                    const dateBox = $(
                        `<div class="mb-3"> posted at: ${comment.date} </div>`
                    );

                    listItem.append(dateBox);

                    // Score
                    const scoreDiv = $(
                        '<div class="review-box__top-box d-flex"></div>'
                    );
                    const scoreBox = $(
                        '<div class="review-box__top-box__score d-flex justify-content-center align-items-center me-2"><h4></h4></div>'
                    );
                    scoreBox.find("h4").text(comment.score.toFixed(1));
                    scoreDiv.append(scoreBox);

                    // Tags
                    const tagsBox = $(
                        '<div class="review-box__top-box__tags-box d-flex flex-wrap  ms-2"></div>'
                    );
                    $.each(comment.tags, function (_, tag) {
                        tagsBox.append(
                            $(
                                '<p class="tag btn btn-primary m-1 px-2 py-0"></p>'
                            ).text(tag)
                        );
                    });
                    scoreDiv.append(tagsBox);
                    listItem.append(scoreDiv);

                    // Comment text and "See more details"
                    const reviewBox = $(
                        '<div class="review-box__bottom-box my-3 d-flex flex-column"></div>'
                    );
                    const commentParagraph = $(
                        '<p class="mb-3 comment-content"></p>'
                    ).text(comment.review);
                    reviewBox.append(commentParagraph);

                    if (comment.review.length > 200) {
                        // Truncate text
                        commentParagraph
                            .addClass("truncated")
                            .attr("data-fulltext", comment.review);
                        commentParagraph.text(
                            comment.review.substring(0, 200) + "..."
                        );

                        // "See more details" button
                        const seeMoreButton = $(
                            '<button class="align-self-end see-more">See more details</button>'
                        );

                        seeMoreButton.on("click", function () {
                            if (commentParagraph.hasClass("truncated")) {
                                commentParagraph
                                    .text(
                                        commentParagraph.attr("data-fulltext")
                                    )
                                    .removeClass("truncated")
                                    .addClass("expanded");
                                $(this).text("See less details");
                            } else {
                                commentParagraph
                                    .text(
                                        commentParagraph
                                            .attr("data-fulltext")
                                            .substring(0, 200) + "..."
                                    )
                                    .removeClass("expanded")
                                    .addClass("truncated");
                                $(this).text("See more details");
                            }
                        });

                        reviewBox.append(seeMoreButton);
                    }

                    listItem.append(reviewBox);
                    $("#comments").append(listItem);
                });
            });
        })
        .catch((error) => {
            console.log("Error getting documents ", error);
        });
}

const getParams = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const propertyId = urlParams.get("propertyId")?.trim();
    return propertyId;
};

getPropertyDataFromDBAndDisplay(getParams());

// ---------------------- Display score ----------------------
// ---------------------- Display score ----------------------
// ---------------------- Display score ----------------------
// ---------------------- Display score ----------------------

function displayScore() {
    const propertyId = "some-property-id";

    db.collection("Reviews")
        .where("propertyId", "==", propertyId)
        .get()
        .then((querySnapshot) => {
            let totalScore = 0;
            let reviewCount = 0;

            querySnapshot.forEach((doc) => {
                let review = doc.data();
                totalScore += review.score;
                reviewCount++;
            });

            if (reviewCount > 0) {
                let averageScore = totalScore / reviewCount;
                updateScoreBox(averageScore);
            } else {
                updateScoreBox("No reviews yet");
            }
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
}

function updateScoreBox(score) {
    $("#score-box__score-id").text(score);
}

displayScore();

// ---------------------- Display score ----------------------
// ---------------------- Display score ----------------------
// ---------------------- Display score ----------------------
// ---------------------- Display score ----------------------
// ---------------------- Display score ----------------------
