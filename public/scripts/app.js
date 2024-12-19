function isEmpty(input) {
  if (input.value.trim() === "") {
    return true;
  } else {
    return false;
  }
}

function checkLength(input, min, max) {
  if (input.value.length < min) {
    return "petit";
  } else if (input.value.length > max) {
    return "grand";
  } else {
    return "bon";
  }
}
//
function passwordsMatch(input1, input2) {
  if (input1.value.trim() !== input2.value.trim()) {
    showError(input2, "Passwords don't match!");
  }
}
//
function showError(input, message) {
  const parent = input.parentElement;
  const small = parent.querySelector("small");
  parent.className = "input-groupe error";
  small.innerText = message;
}
//
function showSuccess(input) {
  const parent = input.parentElement;
  parent.className = "input-groupe success";
}
//
// function getFieldName(input) {
//   return input.id.charAt(0).toUpperCase() + input.id.slice(1);
// }
//-----------------------------Validité email-------------------
function isValidEmail(input) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(input.value)) {
    return false;
  } else {
    return true;
  }
}

// ------------------------- VERIFY PASSWORD ------------------------------
function checkPassword(input) {
  if (isEmpty(input)) {
    showError(input, "ce champ est obligatoire");
  } else if (checkLength(input, 2, 10) === "petit") {
    showError(input, "doit avoir minimum 6 caracteres");
  } else if (checkLength(input, 2, 10) === "grand") {
    showError(input, "doit avoir maximum 10 caracteres");
  } else {
    showSuccess(input);
  }
}

// ------------------------- VERIFY MAIL ------------------------------
function checkMail(input) {
  if (isEmpty(input)) {
    showError(input, "ce champ est obligatoire");
  } else if (!isValidEmail(input)) {
    showError(input, "mail invalid");
  } else {
    showSuccess(input);
  }
}

// form.addEventListener("submit", function (e) {
//   checkMail(login);
//   checkPassword(password);
// });
