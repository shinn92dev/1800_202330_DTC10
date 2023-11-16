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
            hourCycle: "h23",
            year: "2-digit",
            month: "2-digit",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
        username: "User " + createRandomUsername(5),
    }));
}

function roundDownToNearestHalf(num) {
    return Math.floor(num * 2) / 2;
}

function calculateAverageScores(reviews) {
    const totals = reviews.reduce(
        (sums, review) => {
            sums.total += review.overallScore;
            sums.cleanliness += review.eachScore.cleanliness;
            sums.houserule += review.eachScore.houserule;
            sums.landlord += review.eachScore.landlord;
            sums.location += review.eachScore.location;
            sums.price += review.eachScore.price;
            return sums;
        },
        {
            total: 0,
            cleanliness: 0,
            houserule: 0,
            landlord: 0,
            location: 0,
            price: 0,
        }
    );

    return {
        overall: roundDownToNearestHalf(totals.total / reviews.length),
        cleanliness: roundDownToNearestHalf(
            totals.cleanliness / reviews.length
        ),
        houserule: roundDownToNearestHalf(totals.houserule / reviews.length),
        landlord: roundDownToNearestHalf(totals.landlord / reviews.length),
        location: roundDownToNearestHalf(totals.location / reviews.length),
        price: roundDownToNearestHalf(totals.price / reviews.length),
    };
}

function appendReviewToDOM(review) {
    const listItem = $('<li class="my-3 p-3"></li>');

    const reviewTopDiv = $(
        `<div class="d-flex justify-content-between"></div>`
    );
    const reviewTopDivLeft = $(`<div class="d-flex flex-column"></div>`);
    const reviewTopDivRight = $(
        `<div id="review-vote-box" class="d-flex mb-3 align-items-center"></div>`
    );
    const vote = $(
        `<i class="bi bi-hand-thumbs-up"></i><span id="vote-result">0</span><i class="bi bi-hand-thumbs-down"></i>`
    );
    // User name
    // listItem
    reviewTopDivLeft.append($('<h3 class="mb-1"></h3>').text(review.username));
    // Date
    // const dateBox = ;
    reviewTopDivLeft.append($(`<div class="mb-3">${review.date} </div>`));
    reviewTopDivRight.append(vote);

    reviewTopDiv.append(reviewTopDivLeft);
    reviewTopDiv.append(reviewTopDivRight);
    listItem.append(reviewTopDiv);

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

function getStarRating(score) {
    let ratingHtml = "";
    for (let i = 0; i < 5; i++, score--) {
        if (score >= 1) {
            ratingHtml += '<i class="bi bi-star-fill"></i>';
        } else if (score >= 0.5) {
            ratingHtml += '<i class="bi bi-star-half"></i>';
        } else {
            ratingHtml += '<i class="bi bi-star"></i>';
        }
    }
    return ratingHtml;
}

function updateCategoryRatings(scores) {
    for (const [category, score] of Object.entries(scores)) {
        const selector = "#" + category + "-rating";
        const ratingHtml = getStarRating(score);
        $(selector).html(ratingHtml);
    }
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
        const scores = calculateAverageScores(reviews);
        updateCategoryRatings(scores);
        const formattedReviews = formatReviewData(reviews);
        formattedReviews.forEach((review) => appendReviewToDOM(review));
        $("#average-score").text(scores.overall);
        $("#property-address").text(property);
    } catch (error) {
        console.error("Error getting documents", error);
    }
});
function directToReviewFormPage() {
    firebase.auth().onAuthStateChanged((user) => {
        // Check if user is signed in:
        if (user) {
            window.location.href = "/review.html";
            window.localStorage.setItem("userUID", user.uid);
        } else {
            window.location.href = "/login.html";
        }
    });
}

const commentBtn = document.getElementById("leave-comment-btn");
console.log(commentBtn);
commentBtn.addEventListener("click", directToReviewFormPage);
