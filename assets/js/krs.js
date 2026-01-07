document.addEventListener("DOMContentLoaded", () => {
  // --- DATA DUMMY ---
  const matkulTawaran = [
    { id: "MK001", nama: "Pemrograman Web", sks: 3, jadwal: "Senin, 08:00" },
    { id: "MK002", nama: "Basis Data", sks: 4, jadwal: "Selasa, 10:00" },
    { id: "MK003", nama: "Kecerdasan Buatan", sks: 3, jadwal: "Rabu, 13:00" },
    { id: "MK004", nama: "Jaringan Komputer", sks: 3, jadwal: "Kamis, 08:00" },
    { id: "MK005", nama: "Sistem Operasi", sks: 3, jadwal: "Jumat, 09:00" },
  ];

  let matkulDiambil = []; // Array keranjang KRS

  // --- ELEMENT REFERENCES ---
  const tableTawaran = document.getElementById("table-tawaran-body");
  const tableKRS = document.getElementById("table-krs-body");
  const totalSKSLabel = document.getElementById("total-sks");

  // Modal Elements
  const modal = document.getElementById("confirmation-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const btnCancel = document.getElementById("btn-cancel");
  const btnConfirm = document.getElementById("btn-confirm");

  // Status Elements (SC 4.1.3)
  const liveAnnouncer = document.getElementById("live-announcer");
  const toastContainer = document.getElementById("toast-container");
  const toastMessage = document.getElementById("toast-message");

  let pendingAction = null; // Menyimpan aksi sementara sebelum dikonfirmasi
  let lastFocusedElement = null; // Untuk mengembalikan fokus setelah modal tutup

  // --- RENDER FUNCTIONS ---
  function renderTabel() {
    // 1. Render Tawaran
    tableTawaran.innerHTML = "";
    matkulTawaran.forEach((mk) => {
      const isTaken = matkulDiambil.some((m) => m.id === mk.id);
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${mk.id}</td>
                <td>${mk.nama}</td>
                <td>${mk.sks}</td>
                <td>${mk.jadwal}</td>
                <td>
                    ${
                      isTaken
                        ? '<span class="text-muted">Sudah diambil</span>'
                        : `<button class="btn-sm btn-add" data-id="${mk.id}" aria-label="Tambah ${mk.nama} ke KRS">Tambah</button>`
                    }
                </td>
            `;
      tableTawaran.appendChild(row);
    });

    // 2. Render KRS Saya
    tableKRS.innerHTML = "";
    if (matkulDiambil.length === 0) {
      tableKRS.innerHTML =
        '<tr><td colspan="4" class="text-center">Belum ada mata kuliah diambil.</td></tr>';
    } else {
      matkulDiambil.forEach((mk) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${mk.id}</td>
                    <td>${mk.nama}</td>
                    <td>${mk.sks}</td>
                    <td>
                        <button class="btn-sm btn-delete" data-id="${mk.id}" aria-label="Hapus ${mk.nama} dari KRS">Hapus</button>
                    </td>
                `;
        tableKRS.appendChild(row);
      });
    }

    // 3. Update SKS
    const total = matkulDiambil.reduce((acc, curr) => acc + curr.sks, 0);
    totalSKSLabel.textContent = total;
  }

  // --- EVENT LISTENERS (DELEGATION) ---
  // Handle Tombol Tambah
  tableTawaran.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-add")) {
      const id = e.target.getAttribute("data-id");
      const mk = matkulTawaran.find((m) => m.id === id);
      openModal("add", mk, e.target);
    }
  });

  // Handle Tombol Hapus
  tableKRS.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const id = e.target.getAttribute("data-id");
      const mk = matkulDiambil.find((m) => m.id === id);
      openModal("delete", mk, e.target);
    }
  });

  // --- MODAL LOGIC (SC 3.3.4 & SC 2.4.3) ---
  function openModal(action, data, triggerElement) {
    lastFocusedElement = triggerElement; // Simpan posisi fokus terakhir
    pendingAction = { action, data };

    if (action === "add") {
      modalTitle.textContent = "Tambah Mata Kuliah";
      modalDesc.textContent = `Apakah Anda yakin ingin menambahkan "${data.nama}" (${data.sks} SKS)?`;
      btnConfirm.className = "btn-primary";
      btnConfirm.textContent = "Ya, Tambahkan";
    } else {
      modalTitle.textContent = "Hapus Mata Kuliah";
      modalDesc.textContent = `Apakah Anda yakin ingin menghapus "${data.nama}"?`;
      btnConfirm.className = "btn-delete";
      btnConfirm.textContent = "Ya, Hapus";
    }

    modal.classList.remove("hidden");

    // FOCUS TRAP LOGIC: Pindahkan fokus ke dalam modal
    btnCancel.focus();

    // Tangani Tab agar tidak keluar modal
    modal.addEventListener("keydown", trapFocus);
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.removeEventListener("keydown", trapFocus);
    pendingAction = null;

    // Kembalikan fokus ke tombol pemicu (SC 2.4.3)
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function trapFocus(e) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab biasa
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    if (e.key === "Escape") closeModal();
  }

  // Modal Actions
  btnCancel.addEventListener("click", closeModal);

  btnConfirm.addEventListener("click", () => {
    if (pendingAction) {
      const { action, data } = pendingAction;

      if (action === "add") {
        matkulDiambil.push(data);
        announce(`Berhasil menambahkan mata kuliah ${data.nama}`);
      } else {
        matkulDiambil = matkulDiambil.filter((m) => m.id !== data.id);
        announce(`Berhasil menghapus mata kuliah ${data.nama}`);
      }

      renderTabel();
      closeModal();
    }
  });

  // --- TOAST & SCREEN READER ANNOUNCER (SC 4.1.3) ---
  function announce(message) {
    // 1. Visual Toast
    toastMessage.textContent = message;
    toastContainer.classList.remove("toast-hidden");
    setTimeout(() => {
      toastContainer.classList.add("toast-hidden");
    }, 3000);

    // 2. Screen Reader (Invisible)
    liveAnnouncer.textContent = message;
  }
  // ... (Kode sebelumnya tetap ada) ...

  // --- FITUR CETAK ---
  const btnPrint = document.getElementById("btn-print");

  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      // Cek dulu apakah ada matkul diambil?
      if (matkulDiambil.length === 0) {
        alert(
          "Anda belum mengambil mata kuliah apapun. Silakan ambil mata kuliah sebelum mencetak."
        );
        return;
      }
      window.print(); // Memanggil dialog print bawaan browser
    });
  }
  // Initialize
  renderTabel();
});
