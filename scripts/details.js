function getVoteData(lis) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log(user.uid);
            const userCollection = db.collection("Users").doc(user.uid);
            userCollection.get().then((doc) => {
                console.log(doc.data());
                console.log(lis);
                displayStoredVote(lis, doc.data().vote);
            });
        }
    });
}

function displayStoredVote(lis, reviewObj) {
    lis.forEach((li) => {
        const liId = li.id;
        const reviewObjKeys = Object.keys(reviewObj);
        // console.log(reviewObjKeys);
        const upIcon = li.querySelector(".vote-icon-up");
        const downIcon = li.querySelector(".vote-icon-down");
        reviewObjKeys.forEach((key) => {
            if (liId == key) {
                console.log(liId);
                console.log(key);
                console.log(reviewObj[key]);
                if (reviewObj[key] == "up") {
                    console.log("HEREHEHRHEHRHEHRHEH");
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
function updateVoteCountToReviews(reviewId, score) {
    db.collection("Reviews").doc(reviewId).update({ voteCount: score });
}
function updateVoteCountToUsers(reviewId, voteStatus) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            const storeValue = {};
            storeValue[reviewId] = voteStatus;
            db.collection("Users")
                .doc(user.uid)
                .set({ vote: storeValue }, { merge: true });
        }
    });
}
function displayVoteCount(reviewLis, reviews) {
    let score;
    let reviewId;
    reviewLis.forEach((li) => {
        reviewId = li.id;
        reviews.forEach((review) => {
            if (review.reviewId == reviewId) {
                score = review.voteCount;
            }
            if (li.id == reviewId) {
                li.querySelector("span").textContent = score;
            }
        });
    });
}

function voteReview(icons) {
    icons.forEach((icon) => {
        icon.addEventListener("click", (e) => {
            const reviewId = e.target.closest("li").id;

            let score = Number(
                e.target.closest("li").querySelector("span").textContent
            );
            let voteStatus = "";
            console.log(score);
            let targetClassList = e.target.classList;
            if (targetClassList.contains("vote-icon")) {
                if (targetClassList.contains("vote-icon-up")) {
                    targetClassList.toggle("bi-hand-thumbs-up");
                    targetClassList.toggle("bi-hand-thumbs-up-fill");
                    if (targetClassList.contains("bi-hand-thumbs-up")) {
                        score--;
                        voteStatus = null;
                    } else if (
                        targetClassList.contains("bi-hand-thumbs-up-fill")
                    ) {
                        score++;
                        voteStatus = "up";
                    }
                    const downIcon = e.target
                        .closest("li")
                        .querySelector(".vote-icon-down");
                    if (
                        downIcon.classList.contains("bi-hand-thumbs-down-fill")
                    ) {
                        console.log();
                        downIcon.classList.toggle("bi-hand-thumbs-down-fill");
                        downIcon.classList.toggle("bi-hand-thumbs-down");
                        score++;
                    }
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
                        console.log();
                        upIcon.classList.toggle("bi-hand-thumbs-up-fill");
                        upIcon.classList.toggle("bi-hand-thumbs-up");
                        score--;
                    }
                }
                console.log(score);
                console.log(voteStatus);
                e.target.closest("li").querySelector("span").textContent =
                    score;
                updateVoteCountToReviews(reviewId, score);
                updateVoteCountToUsers(reviewId, voteStatus);
            }
        });
    });
}
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
    const reviews = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            reviewId: doc.id,
            ...data,
        };
    });
    return reviews;
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

const commentLink = document.getElementById("leave-comment-btn");

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

commentLink.addEventListener("click", directToReviewFormPage);

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

function displayBookmark(propertyId) {
    currentUser.get().then((userDoc) => {
        const bookmarks = userDoc.data().bookmarks || [];
        const bookmarkIcon = document.getElementById("bookmark");
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

function handleModalSignUpAlert() {
    const voteIcons = document.querySelectorAll("#comments i");
    const bookmarkIcon = document.querySelector("#bookmark");
    const iconArr = [bookmarkIcon, ...voteIcons];
    const overlay = document.querySelector("#overlay");
    const modalBox = document.querySelector("#sign-up-alert");
    const cancelIcon = document.querySelector("#sign-up-alert button");
    const body = document.querySelector("body");
    iconArr.forEach((icon) => {
        icon.addEventListener("click", (e) => {
            body.classList.add("modal_effect");
            window.scrollTo(0, 0);
            console.log(body.scrollTop);
            overlay.classList.remove("hidden");
            modalBox.classList.remove("hidden");
        });
    });
    cancelIcon.addEventListener("click", (e) => {
        overlay.classList.add("hidden");
        modalBox.classList.add("hidden");
        body.classList.remove("modal_effect");
    });

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
        const icons = document.querySelectorAll(".review-vote-box");
        const reviewLis = document.querySelectorAll("li.review-li");
        // displayBookmark(propertyId);
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                displayBookmark(propertyId);
                getVoteData(reviewLis);
                displayVoteCount(reviewLis, reviews);
                voteReview(icons);
            } else {
                console.log("asdffffffffffffffffffff");
                handleModalSignUpAlert();
            }
        });
    } catch (error) {
        console.error("Error getting documents", error);
    }
});
