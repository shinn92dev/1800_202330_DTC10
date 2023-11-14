const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function createRandomUsername(length) {
    return Array.from(
        { length },
        () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");
}

async function getPropertyReviews(propertyId) {
    const reviewsCollection = db.collection("Reviews");
    const querySnapshot = await reviewsCollection
        .where("propertyId", "==", propertyId)
        .orderBy("createdAt", "desc")
        .get();
    return querySnapshot.docs.map((doc) => doc.data());
}

function formatReviewData(reviews) {
    return reviews.map((review) => ({
        ...review,
        date: review.createdAt.toDate().toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
        username: "User " + createRandomUsername(5),
    }));
}

function calculateAverageScore(reviews) {
    const totalScore = reviews.reduce(
        (acc, review) => acc + review.overallScore,
        0
    );
    return (totalScore / reviews.length).toFixed(1);
}

function appendReviewToDOM(review) {
    const listItem = $('<li class="my-3 p-3"></li>');

    // User name
    listItem.append($('<h3 class="mb-3"></h3>').text(review.username));

    // Date
    const dateBox = $(`<div class="mb-3"> posted at: ${review.date} </div>`);
    listItem.append(dateBox);

    // Score
    const scoreDiv = $('<div class="review-box__top-box d-flex"></div>');
    const scoreBox = $(
        '<div class="review-box__top-box__score d-flex justify-content-center align-items-center me-2"><h4></h4></div>'
    );
    scoreBox.find("h4").text(review.overallScore.toFixed(1));
    scoreDiv.append(scoreBox);

    // Tags
    const tagsBox = $(
        '<div class="review-box__top-box__tags-box d-flex flex-wrap  ms-2"></div>'
    );
    review.tags.forEach((tag) => {
        tagsBox.append(
            $('<p class="tag btn btn-primary m-1 px-2 py-0"></p>').text(tag)
        );
    });
    scoreDiv.append(tagsBox);
    listItem.append(scoreDiv);

    // Comment text and "See more details"
    const reviewBox = $(
        '<div class="review-box__bottom-box my-3 d-flex flex-column"></div>'
    );
    const commentParagraph = $('<p class="mb-3 comment-content"></p>').text(
        review.review
    );
    reviewBox.append(commentParagraph);

    if (review.review.length > 200) {
        // Truncate text
        commentParagraph
            .addClass("truncated")
            .attr("data-fulltext", review.review)
            .text(review.review.substring(0, 200) + "...");

        // "See more details" button
        const seeMoreButton = $(
            '<button class="align-self-end see-more">See more details</button>'
        );
        seeMoreButton.on("click", function () {
            if (commentParagraph.hasClass("truncated")) {
                commentParagraph
                    .text(commentParagraph.attr("data-fulltext"))
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
}

async function getProperty(propertyId) {
    const propertiesCollection = db.collection("Properties");
    const docSnapshot = await propertiesCollection.doc(propertyId).get();

    const { propertyFullAddress = "", postalCode = "" } = docSnapshot.data();
    const formatAddress = [propertyFullAddress, postalCode].join(", ");
    return formatAddress;
}

$(document).ready(async function () {
    const propertyId = new URLSearchParams(window.location.search)
        .get("propertyId")
        ?.trim();
    if (!propertyId) {
        window.location.href = "/index.html";
        return;
    }

    try {
        const property = await getProperty(propertyId);
        const reviews = await getPropertyReviews(propertyId);
        const formattedReviews = formatReviewData(reviews);
        formattedReviews.forEach((review) => appendReviewToDOM(review));
        $("#average-score").text(calculateAverageScore(reviews));
        $("#property-address").text(property);
    } catch (error) {
        console.error("Error getting documents", error);
    }
});
