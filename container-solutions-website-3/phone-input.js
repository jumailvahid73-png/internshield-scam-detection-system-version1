// Phone Input Initialization
function initializePhoneInput(selector) {
  const phoneInputFieldss = document.querySelector(selector);
  if (phoneInputFieldss && typeof window.intlTelInput === "function") {
    phoneInputFieldss.setAttribute("inputmode", "numeric");
    const phoneInput = window.intlTelInput(phoneInputFieldss, {
      preferredCountries: ["ae", "in"],
      utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });
    phoneInputFieldss.addEventListener('input', function (e) {
      const phoneNumber = phoneInput.getNumber();
      phoneInputFieldss.value = phoneNumber;
    });
  }
}

// Initialize phone inputs for all required fields
document.addEventListener('DOMContentLoaded', function() {
  initializePhoneInput("#number");
  initializePhoneInput("#snumber");
  initializePhoneInput("#clist-number");
  initializePhoneInput("#c-number");
});
