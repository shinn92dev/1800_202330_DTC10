document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const inputUnit = document.getElementById("inputUnit");
  const inputAddress = document.getElementById("inputAddress");
  const inputCity = document.getElementById("inputCity");
  const postalCodeInput = document.getElementById('inputPostalCode');
  const policyElement = document.getElementById('policy');
  const invalidCheck = document.getElementById('invalidCheck')
  const submitBtn = document.getElementById("submit-btn");
  let propertyArray = [];

  // Initialize Firestore listener
  db.collection("Properties").onSnapshot(snapshot => {
    propertyArray = snapshot.docs.map(doc => doc.data().propertyFullAddress);
  });

  // Validate Canadian Postal Code
  function isValidCanadianPostalCode(postalCode) {
    const regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    return regex.test(postalCode);
  }

  function validateField(field, isValid) {
    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid);
  }

  function validateCity() {
    const isValid = inputCity.value.trim() !== '';
    validateField(inputCity, isValid);
    return isValid;
  }

  function validateAddress() {
    const isValid = inputAddress.value.trim() !== '';
    validateField(inputAddress, isValid);
    return isValid;
  }

  function validatePostalCode() {
    const isValid = isValidCanadianPostalCode(postalCodeInput.value.trim());
    validateField(postalCodeInput, isValid);
    return isValid;
  }

  function validateCheckbox() {
    const isValid = invalidCheck.checked;
    validateField(invalidCheck, isValid)
    return isValid;
  }

  function isAddressUnique() {
    const userInputAddress = `${inputUnit.value} ${inputAddress.value}, ${inputCity.value}`.trim();
    return !propertyArray.includes(userInputAddress);
  }

  function updateWarningMessage(message, display) {
    let warningMsg = document.getElementById("warning-msg") || document.createElement("p");
    warningMsg.id = "warning-msg";
    warningMsg.style.color = "red";
    warningMsg.textContent = message;

    if (display) {
      submitBtn.parentNode.insertBefore(warningMsg, submitBtn.nextSibling);
    } else {
      if (warningMsg) warningMsg.remove();
    }
  }

  function formatPostalCode(postalCode) {
  const cleanedCode = postalCode.trim().replace(/[^a-zA-Z0-9]/g, " ");
  return cleanedCode
}

  function validateInput() {
    const isCityValid = validateCity();
    const isAddressValid = validateAddress();
    const isPostalValid = validatePostalCode();
    const isUniqueAddress = isAddressUnique();
    const isCheckValid = validateCheckbox();

    const allValid = isCityValid && isAddressValid && isPostalValid && isCheckValid;

    if (!isUniqueAddress) {
      updateWarningMessage("Address already exists", true);
    } else {
      updateWarningMessage("", false);
    }

    submitBtn.disabled = !allValid || !isUniqueAddress;

    if(allValid && isUniqueAddress) {
      const userPostalCode = formatPostalCode(postalCodeInput.value.trim())
      submitBtn.onclick = async function() {
        try {
           const addProperty = await addDoc(collection(db, "Properties"), {
          propertyFullAddress: userInputAddress,
          postalCode: userPostalCode
        });

        const newPropertyId = addProperty.id

        window.location.href = `review.html?propertyId=${newPropertyId}`;
        } catch (error) {
           console.error("Error adding document: ", error);
        }
       
      }
    }
  }

  [inputCity, inputAddress, postalCodeInput, inputUnit].forEach(element => {
    element.addEventListener('input', () => {
      validateInput();
      submitBtn.disabled = false; // Enable submit button on input change
    });
  });

  invalidCheck.addEventListener('change', validateInput);
  document.getElementById('needs-validation').addEventListener('submit', function(event) {
  event.preventDefault();
  validateInput();
});


  // enable check box when policy is scrolled until the bottom
   let isScrolledToEnd = false;

  policyElement.addEventListener('scroll', function() {
    if (!isScrolledToEnd && policyElement.scrollHeight - policyElement.scrollTop - policyElement.clientHeight < 1) {
      invalidCheck.disabled = false;
      isScrolledToEnd = true;
    }
  });

});
