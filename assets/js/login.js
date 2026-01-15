document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");
  const errorText = document.getElementById("error-text");

  // --- ELEMENTS FOR PASSWORD TOGGLE ---
  const togglePasswordBtn = document.getElementById("togglePassword");
  const iconShow = document.getElementById("icon-show");
  const iconHide = document.getElementById("icon-hide");

  // --- LOGIC: Toggle Password Visibility ---
  togglePasswordBtn.addEventListener("click", () => {
    // 1. Cek tipe saat ini (password atau text)
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";

    // 2. Ubah tipe input
    passwordInput.setAttribute("type", type);

    // 3. Ubah Ikon & Aria Label (Penting untuk Screen Reader)
    if (type === "text") {
      // Mode Terlihat
      iconShow.classList.add("hidden");
      iconHide.classList.remove("hidden");
      togglePasswordBtn.setAttribute("aria-label", "Sembunyikan kata sandi");
    } else {
      // Mode Tersembunyi
      iconHide.classList.add("hidden");
      iconShow.classList.remove("hidden");
      togglePasswordBtn.setAttribute("aria-label", "Tampilkan kata sandi");
    }
  });

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
