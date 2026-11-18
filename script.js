/* ---------- elements ---------- */
const cardWrap = document.getElementById("cardWrap");
const card = document.getElementById("card");
const themeBtn = document.getElementById("themeToggle");

const views = {
  login: document.getElementById("loginView"),
  register: document.getElementById("registerView"),
  success: document.getElementById("successView"),
};

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

/* ---------- light / dark mode ---------- */
themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
});

/* ---------- mouse spotlight on the card ---------- */
card.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--mx", e.clientX - rect.left + "px");
  card.style.setProperty("--my", e.clientY - rect.top + "px");
});

/* ---------- switching between views ---------- */
function showView(name) {
  Object.entries(views).forEach(([key, el]) => {
    el.classList.toggle("hidden", key !== name);
  });
}

function clearErrors(form) {
  form.querySelectorAll(".error").forEach((p) => (p.textContent = ""));
  form.querySelectorAll(".field.invalid").forEach((f) => f.classList.remove("invalid"));
}

document.getElementById("showRegister").addEventListener("click", () => {
  clearErrors(loginForm);
  showView("register");
  document.getElementById("regName").focus();
});

document.getElementById("showLogin").addEventListener("click", () => {
  clearErrors(registerForm);
  showView("login");
  document.getElementById("email").focus();
});

/* ---------- show / hide password (works for every eye button) ---------- */
document.querySelectorAll(".eye").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    btn.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
  });
});

/* ---------- helpers ---------- */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setError(input, errorEl, message) {
  errorEl.textContent = message;
  const field = input.closest(".field");
  if (field) field.classList.toggle("invalid", Boolean(message));
}

function shake() {
  cardWrap.classList.remove("shake");
  void cardWrap.offsetWidth; // restart animation
  cardWrap.classList.add("shake");
}

function setLoading(btn, loading, loadingText, normalText) {
  btn.disabled = loading;
  btn.classList.toggle("loading", loading);
  btn.querySelector(".btn-text").textContent = loading ? loadingText : normalText;
}

/* =====================================================
   LOGIN
   ===================================================== */
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const loginBtn = document.getElementById("loginBtn");

function validateLogin() {
  let ok = true;
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email) {
    setError(emailInput, emailError, "Email is required");
    ok = false;
  } else if (!emailRegex.test(email)) {
    setError(emailInput, emailError, "Enter a valid email");
    ok = false;
  } else {
    setError(emailInput, emailError, "");
  }

  if (!password) {
    setError(passwordInput, passwordError, "Password is required");
    ok = false;
  } else if (password.length < 6) {
    setError(passwordInput, passwordError, "At least 6 characters");
    ok = false;
  } else {
    setError(passwordInput, passwordError, "");
  }

  return ok;
}

emailInput.addEventListener("input", () => setError(emailInput, emailError, ""));
passwordInput.addEventListener("input", () => setError(passwordInput, passwordError, ""));

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateLogin()) return shake();

  setLoading(loginBtn, true, "Signing in...", "Sign in");

  // TODO: replace this fake delay with your real login code (fetch / Firebase / etc.)
  setTimeout(() => {
    setLoading(loginBtn, false, "", "Sign in");
    // window.location.href = "dashboard.html";
  }, 1500);
});

/* =====================================================
   REGISTER
   ===================================================== */
const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regConfirm = document.getElementById("regConfirm");
const terms = document.getElementById("terms");

const regNameError = document.getElementById("regNameError");
const regEmailError = document.getElementById("regEmailError");
const regPasswordError = document.getElementById("regPasswordError");
const regConfirmError = document.getElementById("regConfirmError");
const termsError = document.getElementById("termsError");

const registerBtn = document.getElementById("registerBtn");
const strengthEl = document.getElementById("strength");
const strengthLabel = document.getElementById("strengthLabel");

/* password strength meter */
function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length < 8) score = Math.min(score, 1);
  return Math.max(score, 1);
}

regPassword.addEventListener("input", () => {
  const level = getStrength(regPassword.value);
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  strengthEl.dataset.level = level;
  strengthLabel.textContent = labels[level];
  setError(regPassword, regPasswordError, "");
});

regName.addEventListener("input", () => setError(regName, regNameError, ""));
regEmail.addEventListener("input", () => setError(regEmail, regEmailError, ""));
regConfirm.addEventListener("input", () => setError(regConfirm, regConfirmError, ""));
terms.addEventListener("change", () => (termsError.textContent = ""));

function validateRegister() {
  let ok = true;
  const name = regName.value.trim();
  const email = regEmail.value.trim();
  const pw = regPassword.value;
  const confirm = regConfirm.value;

  if (name.length < 2) {
    setError(regName, regNameError, "Enter your full name");
    ok = false;
  } else {
    setError(regName, regNameError, "");
  }

  if (!email) {
    setError(regEmail, regEmailError, "Email is required");
    ok = false;
  } else if (!emailRegex.test(email)) {
    setError(regEmail, regEmailError, "Enter a valid email");
    ok = false;
  } else {
    setError(regEmail, regEmailError, "");
  }

  if (!pw) {
    setError(regPassword, regPasswordError, "Password is required");
    ok = false;
  } else if (pw.length < 8) {
    setError(regPassword, regPasswordError, "At least 8 characters");
    ok = false;
  } else {
    setError(regPassword, regPasswordError, "");
  }

  if (!confirm) {
    setError(regConfirm, regConfirmError, "Please confirm your password");
    ok = false;
  } else if (confirm !== pw) {
    setError(regConfirm, regConfirmError, "Passwords don't match");
    ok = false;
  } else {
    setError(regConfirm, regConfirmError, "");
  }

  if (!terms.checked) {
    termsError.textContent = "You need to accept the terms";
    ok = false;
  } else {
    termsError.textContent = "";
  }

  return ok;
}

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateRegister()) return shake();

  setLoading(registerBtn, true, "Creating account...", "Create account");

  const name = regName.value.trim();
  const email = regEmail.value.trim();

  // TODO: replace this fake delay with your real sign-up code
  // (fetch to your backend / Firebase createUserWithEmailAndPassword / etc.)
  setTimeout(() => {
    setLoading(registerBtn, false, "", "Create account");

    document.getElementById("successText").textContent =
      "Welcome, " + name.split(" ")[0] + "! Your profile is ready.";

    // fill the login email so they only need to type the password
    emailInput.value = email;

    registerForm.reset();
    strengthEl.dataset.level = 0;
    strengthLabel.textContent = "";

    showView("success");
  }, 1600);
});

/* success -> back to login */
document.getElementById("goLogin").addEventListener("click", () => {
  showView("login");
  passwordInput.focus();
});