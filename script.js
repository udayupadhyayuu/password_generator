const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const passwordField = document.getElementById("password");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

const toggleEye = document.getElementById("toggleEye");

function generatePassword() {
  const length = parseInt(lengthInput.value);

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

  let password = "";

  const randomValues = new Uint32Array(length);

  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password += chars[randomValues[i] % chars.length];
  }

  passwordField.value = password;

  checkStrength(password);
}

function copyPassword() {
  navigator.clipboard.writeText(passwordField.value);

  showToast();
}

function showToast() {
  const toast = document.getElementById("toast");

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

clearBtn.addEventListener("click", () => {
  passwordField.value = "";

  document.getElementById("strengthBar").style.width = "0%";

  document.getElementById("strengthText").innerText = "Strength: -";
});

toggleEye.addEventListener("click", () => {
  if (passwordField.type === "text") {
    passwordField.type = "password";
    toggleEye.textContent = "👁";
  } else {
    passwordField.type = "text";
    toggleEye.textContent = "🙈";
  }
});

function checkStrength(password) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

  const charsetSize = chars.length;

  const entropy = password.length * Math.log2(charsetSize);

  const bar = document.getElementById("strengthBar");
  const text = document.getElementById("strengthText");

  let label = "";
  let width = "";
  let color = "";

  if (entropy < 40) {
    label = "Weak";
    width = "25%";
    color = "red";
  } else if (entropy < 60) {
    label = "Moderate";
    width = "50%";
    color = "orange";
  } else if (entropy < 80) {
    label = "Strong";
    width = "75%";
    color = "green";
  } else {
    label = "Very Strong";
    width = "100%";
    color = "darkgreen";
  }

  bar.style.width = width;
  bar.style.background = color;

  text.innerText = "Entropy: " + entropy.toFixed(0) + " bits (" + label + ")";
}

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", copyPassword);

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;

  generatePassword();
});

window.onload = generatePassword;
