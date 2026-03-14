const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const passwordField = document.getElementById("password");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

const toggleEye = document.getElementById("toggleEye");

const advancedToggle = document.getElementById("advancedToggle");
const advancedOptions = document.getElementById("advancedOptions");

const includeUpper = document.getElementById("includeUpper");
const includeLower = document.getElementById("includeLower");
const includeNumbers = document.getElementById("includeNumbers");
const includeSymbols = document.getElementById("includeSymbols");

const excludeSimilar = document.getElementById("excludeSimilar");
const excludeAmbiguous = document.getElementById("excludeAmbiguous");

const themeToggle = document.getElementById("themeToggle");

let advancedMode = false;

function generatePassword() {
  const length = parseInt(lengthInput.value);

  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let lower = "abcdefghijklmnopqrstuvwxyz";
  let numbers = "0123456789";
  let symbols = "!@#$%^&*()_+{}[]<>?/|~";

  if (excludeSimilar.checked) {
    const similar = "O0l1I";

    upper = upper
      .split("")
      .filter((c) => !similar.includes(c))
      .join("");
    lower = lower
      .split("")
      .filter((c) => !similar.includes(c))
      .join("");
    numbers = numbers
      .split("")
      .filter((c) => !similar.includes(c))
      .join("");
  }

  if (excludeAmbiguous.checked) {
    symbols = "!@#$%^&*";
  }

  let chars = "";

  if (!advancedMode) {
    chars = upper + lower + numbers + symbols;
  } else {
    if (includeUpper.checked) chars += upper;
    if (includeLower.checked) chars += lower;
    if (includeNumbers.checked) chars += numbers;
    if (includeSymbols.checked) chars += symbols;
  }

  if (chars.length === 0) {
    alert("Select at least one character type");
    return;
  }

  let password = "";

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    password += chars[randomValues[i] % chars.length];
  }

  passwordField.value = password;

  checkStrength(password, chars.length);
  estimateCrackTime(password.length, chars.length);
}

/* STRENGTH METER */

function checkStrength(password, charsetSize) {
  const entropy = password.length * Math.log2(charsetSize);

  const bar = document.getElementById("strengthBar");
  const text = document.getElementById("strengthText");

  let label = "";
  let width = "";
  let gradient = "";

  if (entropy < 40) {
    label = "Weak";
    width = "25%";
    gradient = "linear-gradient(90deg,#ff6b6b,#ff4d4d,#e63946,#ff4d4d)";
  } else if (entropy < 60) {
    label = "Moderate";
    width = "50%";
    gradient = "linear-gradient(90deg,#ffb347,#ffa500,#ff8c00,#ffa500)";
  } else if (entropy < 80) {
    label = "Strong";
    width = "75%";
    gradient = "linear-gradient(90deg,#7bed9f,#2ecc71,#27ae60,#2ecc71)";
  } else {
    label = "Very Strong";
    width = "100%";
    gradient = "linear-gradient(90deg,#2ecc71,#27ae60,#1e8449,#145a32)";
  }

  bar.style.width = width;
  bar.style.background = gradient;
  bar.style.backgroundSize = "200% 100%";

  text.innerText =
    "🧠 Entropy: " + entropy.toFixed(0) + " bits (" + label + ")";
}

/* CRACK TIME */

function estimateCrackTime(length, charset) {
  const guesses = Math.pow(charset, length);

  const guessesPerSecond = 1e12;

  const seconds = guesses / guessesPerSecond;

  let result = "";

  if (seconds < 60) {
    result = seconds.toFixed(2) + " Seconds";
  } else if (seconds < 3600) {
    result = (seconds / 60).toFixed(2) + " Minutes";
  } else if (seconds < 86400) {
    result = (seconds / 3600).toFixed(2) + " Hours";
  } else if (seconds < 604800) {
    result = (seconds / 86400).toFixed(2) + " Days";
  } else if (seconds < 2592000) {
    result = (seconds / 604800).toFixed(2) + " Weeks";
  } else if (seconds < 31536000) {
    result = (seconds / 2592000).toFixed(2) + " Months";
  } else if (seconds < 3153600000) {
    result = (seconds / 31536000).toFixed(2) + " Years";
  } else {
    result = (seconds / 3153600000).toFixed(2) + " Centuries";
  }

  document.getElementById("crackDuration").innerText = result;
}

/* COPY PASSWORD */

function copyPassword() {
  if (!passwordField.value) return;

  navigator.clipboard.writeText(passwordField.value);

  const toast = document.getElementById("toast");

  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2000);
}

/* SHOW / HIDE PASSWORD */

toggleEye.addEventListener("click", () => {
  if (passwordField.type === "text") {
    passwordField.type = "password";
    toggleEye.textContent = "👁";
  } else {
    passwordField.type = "text";
    toggleEye.textContent = "🙈";
  }
});

/* ADVANCED OPTIONS */

advancedToggle.addEventListener("click", () => {
  advancedMode = !advancedMode;

  advancedOptions.style.display = advancedMode ? "block" : "none";

  generatePassword();
});

/* LENGTH SLIDER */

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;

  generatePassword();
});

document.querySelectorAll("#advancedOptions input").forEach((el) => {
  el.addEventListener("change", generatePassword);
});

/* BUTTONS */

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", copyPassword);

clearBtn.addEventListener("click", () => {
  passwordField.value = "";
  document.getElementById("strengthBar").style.width = "0%";
  document.getElementById("strengthText").innerText = "Strength: -";
  document.getElementById("crackDuration").innerText = "-";
});

/* DARK MODE */

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

/* INIT */

window.onload = generatePassword;
