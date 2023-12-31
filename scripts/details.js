// Get vote data from the users collection accordingly
function getVoteData(lis) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const userCollection = db.collection("Users").doc(user.uid);
            userCollection.get().then((doc) => {
                displayStoredVote(lis, doc.data().vote);
            });
        }
    });
}

// Handle click event for the report button on reviews
function handleClickEventForReport() {
    const icons = document.querySelectorAll(".report-icon");
    icons.forEach((icon) => {
        // When icon is clicked
        icon.addEventListener("click", (e) => {
            const reviewId = e.target.closest(".review-li").id;
            const propertyId = new URL(location.href).searchParams.get(
                "propertyId"
            );
            // store corresponding ids to local storage and redirect to contact us page
            window.localStorage.setItem("reviewId", reviewId);
            window.localStorage.setItem("propertyId", propertyId);
            window.location.href = "./contact_us.html";
        });
    });
}

// Handle click event for the report button on property
function handleClickEventForReportForProperty() {
    const button = document.querySelector(".details__report-listing");
    // When icon is clicked
    button.addEventListener("click", (e) => {
        const propertyId = new URL(location.href).searchParams.get(
            "propertyId"
        );
        // store corresponding id to local storage and redirect to contact us page
        window.localStorage.setItem("propertyId", propertyId);
        window.location.href = "./contact_us.html";
    });
}

// Display stored vote result dynamically
function displayStoredVote(lis, reviewObj) {
    lis.forEach((li) => {
        const liId = li.id;
        const reviewObjKeys = Object.keys(reviewObj);
        const upIcon = li.querySelector(".vote-icon-up");
        const downIcon = li.querySelector(".vote-icon-down");
        // Iterate each review element
        reviewObjKeys.forEach((key) => {
            // Get corresponding vote data
            if (liId == key) {
                // Fill or unfill vote icons
                if (reviewObj[key] == "up") {
                    upIcon.classList.add("bi-hand-thumbs-up-fill");
                    upIcon.classList.remove("bi-hand-thumbs-up");
                    downIcon.classList.add("bi-hand-thumbs-down");
                    downIcon.classList.remove("bi-hand-thumbs-down-fill");
                } else if (reviewObj[key] == "down") {
                    upIcon.classList.add("bi-hand-thumbs-up");
                    upIcon.classList.remove("bi-hand-thumbs-up-fill");
                    downIcon.classList.add("bi-hand-thumbs-down-fill");
                    downIcon.classList.remove("bi-hand-thumbs-down");
                } else {
                    upIcon.classList.add("bi-hand-thumbs-up");
                    upIcon.classList.remove("bi-hand-thumbs-up-fill");
                    downIcon.classList.add("bi-hand-thumbs-down");
                    downIcon.classList.remove("bi-hand-thumbs-down-fill");
                }
            }
        });
    });
}

// Store the vote result on corresponding review document
function updateVoteCountToReviews(reviewId, score) {
    db.collection("Reviews").doc(reviewId).update({ voteCount: score });
}

// Store the vote result on corresponding user document
function updateVoteCountToUsers(reviewId, voteStatus) {
    // Only user is signed up
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // create vote result object
            const storeValue = {};
            storeValue[reviewId] = voteStatus;

            // Reference to the document
            const userDocRef = db.collection("Users").doc(user.uid);

            if (voteStatus) {
                // If voteStatus is truthy (upvote or downvote), update the vote field
                userDocRef
                    .set({ vote: storeValue }, { merge: true })
                    .then(() => {
                        console.log("Vote status successfully updated!");
                    })
                    .catch((error) => {
                        console.error("Error updating vote status: ", error);
                    });
            } else {
                // If voteStatus is falsy (cancel vote), delete the specific field in the vote map
                const updateObject = {};
                updateObject[`vote.${reviewId}`] =
                    firebase.firestore.FieldValue.delete();

                userDocRef
                    .update(updateObject)
                    .then(() => {
                        console.log("Vote status successfully deleted!");
                    })
                    .catch((error) => {
                        console.error("Error deleting vote status: ", error);
                    });
            }
        }
    });
}

// Display vote count on corresponding review list on the page
function displayVoteCount(reviewLis, reviews) {
    let score;
    let reviewId;
    // For the each li that is review box
    reviewLis.forEach((li) => {
        reviewId = li.id;
        reviews.forEach((review) => {
            if (review.reviewId == reviewId) {
                // Get corresponding vote count
                score = review.voteCount;
            }
            if (li.id == reviewId) {
                // And display the count on corresponding box
                li.querySelector("span").textContent = score;
            }
        });
    });
}

// Handle click vote icons event
function voteReview(icons) {
    icons.forEach((icon) => {
        icon.addEventListener("click", (e) => {
            // Get corresponding review Id
            const reviewId = e.target.closest("li").id;

            // Get corresponding vote count
            let score = Number(
                e.target.closest("li").querySelector("span").textContent
            );
            let voteStatus = "";
            // Get class lists of targeted element
            let targetClassList = e.target.classList;
            // When user clicks element that has vote-icon class in it
            if (targetClassList.contains("vote-icon")) {
                // if elements clicked is upvote icon,
                if (targetClassList.contains("vote-icon-up")) {
                    // Fill or unfill icon correctly
                    targetClassList.toggle("bi-hand-thumbs-up");
                    targetClassList.toggle("bi-hand-thumbs-up-fill");
                    // Update score
                    if (targetClassList.contains("bi-hand-thumbs-up")) {
                        score--;
                        voteStatus = null;
                    } else if (
                        targetClassList.contains("bi-hand-thumbs-up-fill")
                    ) {
                        score++;
                        voteStatus = "up";
                    }
                    // Fill or unfill icon correctly and update score
                    const downIcon = e.target
                        .closest("li")
                        .querySelector(".vote-icon-down");
                    if (
                        downIcon.classList.contains("bi-hand-thumbs-down-fill")
                    ) {
                        downIcon.classList.toggle("bi-hand-thumbs-down-fill");
                        downIcon.classList.toggle("bi-hand-thumbs-down");
                        score++;
                    }
                    // Do the same thing with the upvote logic for downvote
                } else if (targetClassList.contains("vote-icon-down")) {
                    targetClassList.toggle("bi-hand-thumbs-down-fill");
                    targetClassList.toggle("bi-hand-thumbs-down");
                    if (targetClassList.contains("bi-hand-thumbs-down")) {
                        score++;
                        voteStatus = null;
                    } else if (
                        targetClassList.contains("bi-hand-thumbs-down-fill")
                    ) {
                        score--;
                        voteStatus = "down";
                    }
                    const upIcon = e.target
                        .closest("li")
                        .querySelector(".vote-icon-up");
                    if (upIcon.classList.contains("bi-hand-thumbs-up-fill")) {
                        upIcon.classList.toggle("bi-hand-thumbs-up-fill");
                        upIcon.classList.toggle("bi-hand-thumbs-up");
                        score--;
                    }
                }
                e.target.closest("li").querySelector("span").textContent =
                    score;
                updateVoteCountToReviews(reviewId, score);
                updateVoteCountToUsers(reviewId, voteStatus);
            }
        });
    });
}
let currentUser;

// Get user information
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

// Get corresponding review data
async function getPropertyReviews(propertyId) {
    const reviewsCollection = db.collection("Reviews");
    // Get only related review data
    const querySnapshot = await reviewsCollection
        .where("propertyId", "==", propertyId)
        .orderBy("createdAt", "desc")
        .get();
    const reviews = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            isReviewer: currentUser?.id === data.userId ?? false,
            reviewId: doc.id,
            ...data,
        };
    });
    return reviews;
}

// Format review data to display on the page
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
    }));
}

// Round up the score
function roundDownToNearestHalf(num) {
    return Math.floor(num * 2) / 2;
}

// Calculate the average of the scores
function calculateAverageScores(reviews) {
    // Check if reviews array is empty
    if (reviews.length === 0) {
        return {
            overall: 0,
            cleanliness: 0,
            houserule: 0,
            landlord: 0,
            location: 0,
            price: 0,
        };
    }

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
        overall: roundDownToNearestHalf(totals.total / reviews.length).toFixed(
            1
        ),
        cleanliness: roundDownToNearestHalf(
            totals.cleanliness / reviews.length
        ),
        houserule: roundDownToNearestHalf(totals.houserule / reviews.length),
        landlord: roundDownToNearestHalf(totals.landlord / reviews.length),
        location: roundDownToNearestHalf(totals.location / reviews.length),
        price: roundDownToNearestHalf(totals.price / reviews.length),
    };
}

// Insert data to HTML
function appendReviewToDOM(review) {
    const listItem = $(
        `<li class="my-3 p-3 review-li" id="${review.reviewId}"></li>`
    );

    const reviewTopDiv = $(
        `<div class="d-flex justify-content-between"></div>`
    );
    const reviewTopDivLeft = $(`<div class="d-flex flex-column"></div>`);
    const reviewTopDivRight = $(
        `<div class="review-vote-box d-flex mb-3 align-items-center"></div>`
    );
    const vote = $(
        `<i class="bi bi-hand-thumbs-up vote-icon vote-icon-up"></i><span class="vote-result">0</span><i class="bi bi-hand-thumbs-down vote-icon vote-icon-down"></i>`
    );
    const report = $(`<i class="bi bi-flag report-icon"></i>`);

    reviewTopDivLeft.append($(`<div class="mb-3">${review.date} </div>`));
    reviewTopDivRight.append(vote);
    reviewTopDivRight.append(report);

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
    const commentParagraph = $('<p class="mb-5 comment-content"></p>').text(
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

    if (review.isReviewer) {
        // Delete button setup
        const deleteButton = $(
            `<button class="delete_button btn btn-danger delete-review-btn">Delete</button>`
        );
        deleteButton.click(() => {
            $("#deleteReviewModal").modal("show");
        });
        $("#confirmDelete").attr("id", `confirmDelete-${review.reviewId}`);
        listItem.append(deleteButton);

        // Confirm delete button inside the modal
        $(`#confirmDelete-${review.reviewId}`).click(() =>
            handleDelete(review.reviewId, review.propertyId)
        );
    }

    $("#comments").append(listItem);
}

// Handle event for deleting each review
async function handleDelete(reviewId, propertyId) {
    try {
        // Ensure updatePropertyScore completes before deleting the review
        await updatePropertyScore(reviewId, propertyId);
        await deleteReview(reviewId);
        // Consider a more controlled UI update instead of reloading
        $("#deleteReviewModal").modal("hide");
        window.location.reload();
    } catch (error) {
        // Correct error handling
        console.error("Error in transaction: ", error);
    }
}

// Delete review from the firestore
function deleteReview(reviewId) {
    return db.collection("Reviews").doc(reviewId).delete();
}

// Update property score when new review is created
async function updatePropertyScore(reviewId, propertyId) {
    try {
        const currentReview = await db
            .collection("Reviews")
            .doc(reviewId)
            .get();
        const currentReviewData = currentReview.data();
        const propertyRef = db.collection("Properties").doc(propertyId);

        // Correct error handling in transaction
        await db.runTransaction(async (transaction) => {
            const propertyDoc = await transaction.get(propertyRef);

            if (!propertyDoc.exists) {
                throw "Document does not exist!";
            }

            const propertyData = propertyDoc.data();
            const newOverallScore = Math.max(
                propertyData.overallScore - currentReviewData.overallScore,
                0
            );
            const newReviewCount = Math.max(propertyData.reviewCount - 1, 0);

            transaction.update(propertyRef, {
                overallScore: newOverallScore,
                reviewCount: newReviewCount,
            });
        });
    } catch (error) {
        console.error("Transaction failed: ", error);
    }
}

// Get property detailed data
async function getProperty(propertyId) {
    const propertiesCollection = db.collection("Properties");
    const docSnapshot = await propertiesCollection.doc(propertyId).get();

    const { propertyFullAddress = "", postalCode = "" } = docSnapshot.data();
    const formatAddress = [propertyFullAddress, postalCode].join(", ");
    return formatAddress;
}

// Get overall score for the propert
async function getOverall(propertyId) {
    const propertiesCollection = db.collection("Properties");
    const docSnapshot = await propertiesCollection.doc(propertyId).get();
    return docSnapshot.data().overallScore;
}

// Get number of reviews of the propert
async function getReviewCount(propertyId) {
    const propertiesCollection = db.collection("Properties");
    const docSnapshot = await propertiesCollection.doc(propertyId).get();
    return docSnapshot.data().reviewCount;
}

// Display scores on page with star icon
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

// Update each score invoking getStarRating function
function updateCategoryRatings(scores) {
    for (const [category, score] of Object.entries(scores)) {
        const selector = "#" + category + "-rating";
        const ratingHtml = getStarRating(score);
        $(selector).html(ratingHtml);
    }
}

const commentLink = document.getElementById("leave-comment-btn");

// Redirect to review page
function directToReviewFormPage() {
    firebase.auth().onAuthStateChanged((user) => {
        // Check if user is signed in:
        if (user) {
            const urlParams = new URL(location.href).searchParams;
            const propertyId = urlParams.get("propertyId");
            commentLink.href = "review.html?propertyId=" + propertyId;
            window.localStorage.setItem("userUID", user.uid);
        } else {
            commentLink.href = "login.html";
        }
    });
}

// Handle click event when user click review icon invoking directToReviewFormPage
commentLink.addEventListener("click", directToReviewFormPage);

// Toggle bookmark status for a specific property
function toggleBookmark(propertyId) {
    currentUser.get().then((userDoc) => {
        const bookmarks = userDoc.data().bookmarks || [];
        const isBookmarked = bookmarks.includes(propertyId);
        const firestoreFieldValue = firebase.firestore.FieldValue;

        // Update Firestore based on whether the property is already bookmarked
        currentUser
            .update({
                bookmarks: isBookmarked
                    ? firestoreFieldValue.arrayRemove(propertyId)
                    : firestoreFieldValue.arrayUnion(propertyId),
            })
            .then(() => {
                // Update the icon based on the new bookmark status
                const bookmarkIcon = document.getElementById("bookmark");
                bookmarkIcon.textContent = isBookmarked
                    ? "bookmark_border"
                    : "bookmark";
            })
            .catch((error) => {
                console.error("Error updating bookmarks", error);
            });
    });
}

// Display the bookmark status for a specific property and add a click listener to toggle the bookmark
function displayBookmark(propertyId) {
    // Fetch the current user's document
    currentUser.get().then((userDoc) => {
        const bookmarks = userDoc.data().bookmarks || [];
        const bookmarkIcon = document.getElementById("bookmark");

        // Check if the property is bookmarked and update the bookmark icon accordingly
        if (bookmarks.includes(propertyId)) {
            bookmarkIcon.textContent = "bookmark";
        } else {
            bookmarkIcon.textContent = "bookmark_border";
        }
    });

    // Add click listener to the bookmark icon
    const bookmarkIcon = document.getElementById("bookmark");
    bookmarkIcon.addEventListener("click", function () {
        toggleBookmark(propertyId);
    });
}

// Handle the modal for sign-up alerts and apply effects on various UI elements
function handleModalSignUpAlert() {
    const voteIcons = document.querySelectorAll("#comments i");
    const bookmarkIcon = document.querySelector("#bookmark");
    const iconArr = [bookmarkIcon, ...voteIcons];
    const overlay = document.querySelector("#overlay");
    const modalBox = document.querySelector("#sign-up-alert");
    const cancelIcon = document.querySelector("#sign-up-alert button");
    const body = document.querySelector("body");

    // Add click listeners to different UI elements triggering the modal
    iconArr.forEach((icon) => {
        icon.addEventListener("click", (e) => {
            body.classList.add("modal_effect");
            window.scrollTo(0, 0);
            overlay.classList.remove("hidden");
            modalBox.classList.remove("hidden");
        });
    });

    // Add click listener to the cancel icon inside the modal
    cancelIcon.addEventListener("click", (e) => {
        overlay.classList.add("hidden");
        modalBox.classList.add("hidden");
        body.classList.remove("modal_effect");
    });

    // Add keyup event listener to handle escape and enter keys when the modal is visible
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

// Initialize the back button functionality
function initializeBackButton() {
    $("#go-back").on("click", function (e) {
        e.preventDefault(); // Prevent the default anchor behavior
        window.history.back(); // Go back to the last page in history
    });
}

// Perform all actions when the document is ready.
$(document).ready(async function () {
    // Redirect to the index.html page if no propertyId is found
    const propertyId = new URLSearchParams(window.location.search)
        .get("propertyId")
        ?.trim();
    if (!propertyId) {
        window.location.href = "/index.html";
        return;
    }

    try {
        // Retrieve property information, reviews, and related data
        const property = await getProperty(propertyId);
        const reviews = await getPropertyReviews(propertyId);
        const scores = calculateAverageScores(reviews);
        const reviewCount = await getReviewCount(propertyId);
        const overallScore = await getOverall(propertyId);
        const averageScore = reviewCount !== 0 ? overallScore / reviewCount : 0;

        // Update UI with property details, average score, and category ratings
        updateCategoryRatings(scores);
        const formattedReviews = formatReviewData(reviews);
        formattedReviews.forEach((review) => appendReviewToDOM(review));
        $("#average-score").text(averageScore.toFixed(1));
        $("#property-address").text(property);

        // Set up event handlers for report, vote, and bookmark functionality
        const icons = document.querySelectorAll(".review-vote-box");
        const reviewLis = document.querySelectorAll("li.review-li");
        initializeBackButton();
        handleClickEventForReport();
        handleClickEventForReportForProperty();

        // Check user authentication status and update UI accordingly
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // If user is signed in, display bookmark status, vote data, and enable voting
                displayBookmark(propertyId);
                getVoteData(reviewLis);
                displayVoteCount(reviewLis, reviews);
                voteReview(icons);
            } else {
                // If user is not signed in, handle modal sign-up alert
                handleModalSignUpAlert();
            }
        });
    } catch (error) {
        console.error("Error getting documents", error);
    }
});
