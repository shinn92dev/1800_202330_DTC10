var currentUser;               //points to the document of the user who is logged in 
function populateUserInfo() {
            firebase.auth().onAuthStateChanged(user => {
                // Check if user is signed in:
                if (user) {

                    //go to the correct user document by referencing to the user uid
                    currentUser = db.collection("Users").doc(user.uid)
                    //get the document for current user.
                    currentUser.get()
                        .then(userDoc => {
                            //get the data fields of the user
                            var userName = userDoc.data().userName;
                            var userCity = userDoc.data().city;

                            //if the data fields are not empty, then write them in to the form.
                            if (userName != null) {
                                document.getElementById("nameInput").value = userName;
                            }
                            if (userCity != null) {
                                document.getElementById("cityInput").value = userCity;
                            }
                        })
                } else {
                    // No user is signed in.
                    console.log ("No user is signed in");
                }
            });
        }

//call the function to run it 
populateUserInfo();

function EditUserInfo() {
    document.getElementById("personalInfoFields").disabled = false;
    editBtn.removeEventListener("click", EditUserInfo);
    editBtn.addEventListener("click", CancelEdit);
}

function validateField(field, isValid) {
    field.classList.toggle("is-invalid", !isValid);
    field.classList.toggle("is-valid", isValid);
}

function validateName() {
    const nameInput = document.getElementById("nameInput");
    const isValid = nameInput.value.trim() !== "";
    validateField(nameInput, isValid);
    return isValid;
}

document.getElementById("nameInput").addEventListener("input", () => {
    if(validateName()) {
        saveBtn.disabled = false;
    } else {
        saveBtn.disabled = true;
    }
});

function validateCity() {
    const cityInput = document.getElementById("cityInput");
    const cityInputValue = cityInput.value.trim();
    const isValid = cityInputValue === "" || /^[a-zA-Z]+$/.test(cityInputValue);
    validateField(cityInput, isValid);
    return isValid;
}

document.getElementById("cityInput").addEventListener("input", () => {
    if(validateCity()) {
        saveBtn.disabled = false;
    } else {
        saveBtn.disabled = true;
    }
})

function CancelEdit() {
    document.getElementById("personalInfoFields").disabled = true;
    editBtn.removeEventListener("click", CancelEdit);
    editBtn.addEventListener("click", EditUserInfo);
    populateUserInfo();
}

async function SaveUserInfo() {
    try {
        var userName = document.getElementById("nameInput").value;
        var userCity = document.getElementById("cityInput").value;
        await currentUser.update({
            userName: userName,
            city: userCity
        });
        localStorage.setItem("profileUpdated", "true");
        window.location.reload();
    } catch (error) {
        console.error("Error updating user information:", error);
        displayBannerMessage("Failed to update profile");
    }
}

window.onload = function() {
    if (localStorage.getItem("profileUpdated") === "true") {
        displayBannerMessage("Profile updated successfully");
        console.log("user information updated");
        document.getElementById("personalInfoFields").disabled= true;
        localStorage.removeItem("profileUpdated");
    }
}

function displayBannerMessage(message) {
    const banner = document.getElementById("banner-message");
    banner.innerText = message;
    banner.style.display = "block";
    setTimeout(() => {
        banner.style.display = "none";
    }, 10000);
}

const editBtn = document.getElementById("edit-btn");
const saveBtn = document.getElementById("save-btn");

editBtn.addEventListener("click", EditUserInfo);
saveBtn.addEventListener("click", SaveUserInfo);