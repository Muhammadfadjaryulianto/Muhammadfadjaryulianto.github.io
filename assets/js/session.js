/* File: assets/js/session.js */

document.addEventListener("DOMContentLoaded", () => {
  // --- KONFIGURASI ---
  const SESSION_DURATION = 1800000; // 30 menit
  const WARNING_BUFFER = 120000; // 2 menit warning

  // --- 1. AUTO-INJECT MODAL HTML (FITUR BARU) ---
  // Cek apakah modal sudah ada di halaman? Jika belum, buatkan!
  if (!document.getElementById("session-modal")) {
    const modalHTML = `
            <div id="session-modal" class="modal hidden" role="dialog" aria-modal="true" aria-labelledby="session-title">
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <h2 id="session-title" class="modal-title">Sesi Hampir Habis</h2>
                    <p>Sesi Anda akan berakhir dalam <span id="session-timer">20</span> detik. Apakah Anda ingin memperpanjang sesi?</p>
                    <div class="modal-actions">
                        <button id="close-modal" class="btn-secondary">Logout</button>
                        <button id="extend-session" class="btn-primary">Perpanjang Sesi</button>
                    </div>
                </div>
            </div>
        `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  // --- 2. REFERENSI ELEMEN (Setelah inject selesai) ---
  const sessionModal = document.getElementById("session-modal");
  const timerDisplay = document.getElementById("session-timer");
  const btnExtend = document.getElementById("extend-session");
  const btnLogout = document.getElementById("close-modal");

  // Variabel Timer
  let warningTimeout;
  let logoutTimeout;
  let countdownInterval;

  if (!sessionModal || !btnExtend || !btnLogout) return;

  // --- 3. FUNGSI UTAMA ---
  function startSession() {
    console.log("Sesi dimulai/reset.");

    clearTimeout(warningTimeout);
    clearTimeout(logoutTimeout);
    clearInterval(countdownInterval);

    sessionModal.classList.add("hidden");

    // Timer Warning
    warningTimeout = setTimeout(showWarning, SESSION_DURATION - WARNING_BUFFER);
    // Timer Logout
    logoutTimeout = setTimeout(forceLogout, SESSION_DURATION);
  }

  function showWarning() {
    sessionModal.classList.remove("hidden");
    btnExtend.focus(); // Trap Focus Start

    let secondsLeft = WARNING_BUFFER / 1000;
    timerDisplay.textContent = secondsLeft;

    countdownInterval = setInterval(() => {
      secondsLeft--;
      timerDisplay.textContent = secondsLeft;
      if (secondsLeft <= 0) clearInterval(countdownInterval);
    }, 1000);
  }

  function forceLogout() {
    clearInterval(countdownInterval);
    alert("Waktu sesi habis.");
    window.location.href = "index.html";
  }

  // --- 4. EVENT LISTENERS ---
  btnExtend.addEventListener("click", () => {
    startSession();
    // Kembalikan fokus ke elemen utama halaman (Dashboard/KRS H1)
    const mainHeader = document.querySelector("h1");
    if (mainHeader) mainHeader.focus();
  });

  btnLogout.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Trap Focus Modal Sesi
  sessionModal.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const focusable = [btnLogout, btnExtend];
      const first = focusable[0];
      const last = focusable[1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Mulai saat load
  startSession();
});
