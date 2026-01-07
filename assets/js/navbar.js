document.addEventListener("DOMContentLoaded", () => {
  const navContainer = document.getElementById("navigation-component");

  if (navContainer) {
    // Tambahkan tombol Toggle Menu (Hamburger) di dalam HTML yang di-inject
    navContainer.innerHTML = `
            <button id="mobile-menu-toggle" class="mobile-toggle" aria-label="Buka Menu Navigasi" aria-expanded="false">
                <span class="hamburger-icon" aria-hidden="true">☰</span>
            </button>

            <div id="sidebar-overlay" class="sidebar-overlay"></div>

            <nav id="sidebar-nav" class="sidebar" aria-label="Menu Utama">
                <div class="sidebar-header">
                    <img src="./assets/image/untirta.webp" alt="Logo UNTIRTA" class="sidebar-logo">
                    <span class="sidebar-title">SIAKAD</span>
                    <button id="mobile-menu-close" class="mobile-close" aria-label="Tutup Menu">✕</button>
                </div>
                
                <ul class="nav-list">
                    <li><a href="dashboard.html" class="nav-link" id="nav-dashboard">Dashboard</a></li>
                    <li><a href="krs.html" class="nav-link" id="nav-krs">Kartu Rencana Studi</a></li>
                    <li><a href="nilai.html" class="nav-link" id="nav-nilai">Rekam Nilai</a></li>
                    <li><button id="logoutBtn" class="nav-link btn-logout">Keluar</button></li>
                </ul>
            </nav>
        `;

    // --- Logika Active State (Sama seperti sebelumnya) ---
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const menuMap = {
      "dashboard.html": "nav-dashboard",
      "krs.html": "nav-krs",
      "nilai.html": "nav-nilai",
    };
    const activeId = menuMap[currentPage];
    if (activeId) {
      const activeLink = document.getElementById(activeId);
      if (activeLink) {
        activeLink.classList.add("active");
        activeLink.setAttribute("aria-current", "page");
      }
    }

    // --- Logika Logout (Sama seperti sebelumnya) ---
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
          window.location.href = "index.html";
        }
      });
    }

    // --- LOGIKA BARU: MOBILE MENU TOGGLE ---
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const closeBtn = document.getElementById("mobile-menu-close");
    const sidebar = document.getElementById("sidebar-nav");
    const overlay = document.getElementById("sidebar-overlay");

    function openMenu() {
      sidebar.classList.add("open");
      overlay.classList.add("active");

      // PERBAIKAN: Sembunyikan tombol hamburger agar tidak menumpuk
      toggleBtn.classList.add("hidden");

      toggleBtn.setAttribute("aria-expanded", "true");
      closeBtn.focus(); // Pindahkan fokus ke tombol close (SC 2.4.3)
    }

    function closeMenu() {
      sidebar.classList.remove("open");
      overlay.classList.remove("active");

      // PERBAIKAN: Munculkan kembali tombol hamburger
      toggleBtn.classList.remove("hidden");

      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.focus(); // Kembalikan fokus
    }

    if (toggleBtn) toggleBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);

    // Tutup menu jika tombol ESC ditekan
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar.classList.contains("open")) {
        closeMenu();
      }
    });
  }
  const topbarContainer = document.getElementById("topbar-component");

  if (topbarContainer) {
    // Inject HTML Top Bar
    topbarContainer.innerHTML = `
            <header class="top-bar">
                <div class="user-profile">
                    <span class="user-name">Muhammad Fadjar Yulianto</span>
                    <span class="user-role">Mahasiswa - Informatika</span>
                </div>
            </header>
        `;
  }
});
