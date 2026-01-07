document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email) {
      showError("Mohon masukkan email mahasiswa Anda.", emailInput);
      return;
    }
    if (!email.includes("@")) {
      showError("Format email salah. Harap sertakan simbol '@'.", emailInput);
      return;
    }
    if (!password) {
      showError("Mohon masukkan kata sandi Anda.", passwordInput);
      return;
    }

    alert("Login Berhasil! Mengalihkan ke Dashboard...");
    window.location.href = "dashboard.html";
  });

  function showError(message, focusElement) {
    errorText.textContent = message;
    errorMessage.classList.remove("hidden");
    focusElement.setAttribute("aria-invalid", "true");
    focusElement.focus();
  }

  function hideError() {
    errorMessage.classList.add("hidden");
    emailInput.removeAttribute("aria-invalid");
    passwordInput.removeAttribute("aria-invalid");
  }
});
