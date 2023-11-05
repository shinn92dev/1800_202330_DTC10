commentsData = [
    {
        username: "TESTING 1: small character test [50]",
        score: "3.5",
        comment_text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        tags: ["Quiet", "Clean", "System Kitchen"],
    },
    {
        username: "TESTING 2:  characters test [200]",
        score: "3.0",
        comment_text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod venenatis nibh, in vestibulum est bibendum a. Quisque in mi vel arcu ullamcorper venenatis. Nulla facilisi. Integer ac lacus in arcu bibendum cursus.",
        tags: ["Clean", "System Kitchen"],
    },
    {
        username: "TESTING 3: REALLY LONG TEXT [500]",
        score: "3.0",
        comment_text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod venenatis nibh, in vestibulum est bibendum a. Quisque in mi vel arcu ullamcorper venenatis. Nulla facilisi. Integer ac lacus in arcu bibendum cursus. Sed vel odio eget tortor blandit ullamcorper. Sed tincidunt tortor id lacus viverra, vel posuere dui vehicula. Vivamus ac tincidunt lectus. Donec feugiat magna in tincidunt laoreet. Suspendisse ut arcu non velit semper varius. Sed eget ultricies velit. Vestibulum ac enim non sapien tincidunt condimentum. Nam ut justo eget quam laoreet ultrices in a lectus. Nulla facilisi. Vestibulum nec viverra mi, ac consectetur sapien. Sed interdum dapibus facilisis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus maximus vestibulum diam eu interdum. Fusce interdum ex quis sagittis. Sed at elit vel justo bibendum sagittis. Aliquam auctor hendrerit libero, ut luctus turpis sagittis in. Fusce in bibendum sapien.",
        tags: ["Clean", "System Kitchen"],
    },
    {
        username: "TESTING 3: REALLY LONG TEXT + LOTS OF TAGS [1000]",
        score: "3.0",
        comment_text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod venenatis nibh, in vestibulum est bibendum a. Quisque in mi vel arcu ullamcorper venenatis. Nulla facilisi. Integer ac lacus in arcu bibendum cursus. Sed vel odio eget tortor blandit ullamcorper. Sed tincidunt tortor id lacus viverra, vel posuere dui vehicula. Vivamus ac tincidunt lectus. Donec feugiat magna in tincidunt laoreet. Suspendisse ut arcu non velit semper varius. Sed eget ultricies velit. Vestibulum ac enim non sapien tincidunt condimentum. Nam ut justo eget quam laoreet ultrices in a lectus. Nulla facilisi. Vestibulum nec viverra mi, ac consectetur sapien. Sed interdum dapibus facilisis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Phasellus maximus vestibulum diam eu interdum. Fusce interdum ex quis sagittis. Sed at elit vel justo bibendum sagittis. Aliquam auctor hendrerit libero, ut luctus turpis sagittis in. Fusce in bibendum sapien.",
        tags: [
            "Cleanliness",
            "Kitchen Availability",
            "Gym Facilities",
            "Apartment Amenities",
            "Property Condition",
            "Furnished",
            "Utilities Included",
        ],
    },
];

$(document).ready(function () {
    $.each(commentsData, function (_, comment) {
        const listItem = $('<li class="my-3 p-3"></li>');

        // User name
        listItem.append($('<h3 class="mb-3"></h3>').text(comment.username));

        // Score
        const scoreDiv = $('<div class="review-box__top-box d-flex"></div>');
        const scoreBox = $(
            '<div class="review-box__top-box__score d-flex justify-content-center align-items-center me-2"><h4></h4></div>'
        );
        scoreBox.find("h4").text(comment.score);
        scoreDiv.append(scoreBox);

        // Tags
        const tagsBox = $(
            '<div class="review-box__top-box__tags-box d-flex flex-wrap  ms-2"></div>'
        );
        $.each(comment.tags, function (_, tag) {
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
            comment.comment_text
        );
        reviewBox.append(commentParagraph);

        if (comment.comment_text.length > 200) {
            // Truncate text
            commentParagraph
                .addClass("truncated")
                .attr("data-fulltext", comment.comment_text);
            commentParagraph.text(
                comment.comment_text.substring(0, 200) + "..."
            );

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
    });
});
