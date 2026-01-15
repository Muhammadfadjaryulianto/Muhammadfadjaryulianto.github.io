document.addEventListener("DOMContentLoaded", () => {
  // --- DATA DUMMY NILAI ---
  const allGrades = [
    // Semester Ganjil 2025/2026 (Saat Ini)
    {
      sem: "20251",
      code: "IF401",
      name: "Kecerdasan Buatan",
      sks: 3,
      grade: "A",
      point: 4.0,
    },
    {
      sem: "20251",
      code: "IF402",
      name: "Pemrograman Web Lanjut",
      sks: 4,
      grade: "A",
      point: 4.0,
    },
    {
      sem: "20251",
      code: "IF403",
      name: "Metode Penelitian",
      sks: 2,
      grade: "B",
      point: 3.0,
    },
    {
      sem: "20251",
      code: "IF404",
      name: "Keamanan Jaringan",
      sks: 3,
      grade: "A",
      point: 4.0,
    },

    // Semester Genap 2024/2025
    {
      sem: "20242",
      code: "IF301",
      name: "Basis Data",
      sks: 4,
      grade: "A",
      point: 4.0,
    },
    {
      sem: "20242",
      code: "IF302",
      name: "Algoritma Pemrograman",
      sks: 3,
      grade: "B",
      point: 3.0,
    },
    {
      sem: "20242",
      code: "IF303",
      name: "Sistem Operasi",
      sks: 3,
      grade: "A",
      point: 4.0,
    },

    // Semester Ganjil 2024/2025
    {
      sem: "20241",
      code: "IF201",
      name: "Matematika Diskrit",
      sks: 3,
      grade: "C",
      point: 2.0,
    },
    {
      sem: "20241",
      code: "IF202",
      name: "Bahasa Inggris",
      sks: 2,
      grade: "A",
      point: 4.0,
    },
  ];

  // --- ELEMENTS ---
  const semesterSelect = document.getElementById("semester-select");
  const tableBody = document.getElementById("nilai-table-body");
  const ipsDisplay = document.getElementById("ips-value");
  const sksDisplay = document.getElementById("sks-value");
  const announcer = document.getElementById("filter-announcer");

  // --- FUNCTION: Render Data ---
  function renderTable(semester) {
    // 1. Filter Data
    let filteredData = [];
    if (semester === "all") {
      filteredData = allGrades;
    } else {
      filteredData = allGrades.filter((item) => item.sem === semester);
    }

    // 2. Clear Table
    tableBody.innerHTML = "";

    // 3. Populate Table
    if (filteredData.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="5" class="text-center text-muted">Tidak ada data nilai untuk semester ini.</td></tr>';
      ipsDisplay.textContent = "0.00";
      sksDisplay.textContent = "0";
      return;
    }

    let totalSKS = 0;
    let totalPoints = 0;

    filteredData.forEach((item) => {
      const row = document.createElement("tr");

      // Hitung IPS
      totalSKS += item.sks;
      totalPoints += item.point * item.sks;

      // Tentukan warna badge
      const badgeClass = `grade-${item.grade}`; // grade-A, grade-B, dst

      row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.sks}</td>
                <td><span class="grade-badge ${badgeClass}">${
        item.grade
      }</span></td>
                <td>${item.point.toFixed(2)}</td>
            `;
      tableBody.appendChild(row);
    });

    // 4. Update Summary Cards
    const ips = totalSKS > 0 ? (totalPoints / totalSKS).toFixed(2) : "0.00";
    ipsDisplay.textContent = ips;
    sksDisplay.textContent = totalSKS;

    return {
      count: filteredData.length,
      ips: ips,
      semesterText: semesterSelect.options[semesterSelect.selectedIndex].text,
    };
  }

  // --- EVENT LISTENER (SC 3.2.2) ---
  semesterSelect.addEventListener("change", (e) => {
    const selectedSem = e.target.value;
    const result = renderTable(selectedSem);

    // --- ACCESSIBILITY ANNOUNCEMENT (SC 4.1.2) ---
    // Memberitahu screen reader bahwa konten telah berubah

    // LANGKAH 1: Kosongkan dulu konten announcer agar screen reader mendeteksi adanya "perubahan" baru nanti
    announcer.textContent = "";
    if (result) {
      const message = `Menampilkan ${result.count} mata kuliah untuk ${result.semesterText}. IPS Anda: ${result.ips}`;
      // LANGKAH 2: Gunakan setTimeout (Delay)
      // Kita tunggu 1000ms (1 detik) agar NVDA selesai menyebutkan nama semester dulu.
      setTimeout(() => {
        announcer.textContent = message;
      }, 1000);
    } else {
      setTimeout(() => {
        announcer.textContent = "Tidak ada data untuk semester yang dipilih.";
      }, 1000);
    }
  });

  // --- INITIAL RENDER ---
  // Render default (semester yang terpilih di HTML)
  renderTable(semesterSelect.value);
});
