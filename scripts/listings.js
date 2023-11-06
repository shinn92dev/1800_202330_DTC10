$(document).ready(function () {
    const db = firebase.firestore();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const searchParam = urlParams.get("search").trim();

    console.log("searchParam: ", searchParam);

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
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
});
