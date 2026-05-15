// Fungsi Sistem Navigasi Tab Dashboard
function openTab(evt, tabName) {
    let tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    let tablinks = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// Fitur 1: Subnet Calculator & Auto IP Class Detector
function hitungSubnet() {
    let ipInput = document.getElementById('ipOctet').value;
    let cidr = document.getElementById('cidr').value;
    
    if(!ipInput || !cidr || cidr < 1 || cidr > 32) {
        document.getElementById('hasilSubnet').innerText = "Mohon masukkan IP dan CIDR (1-32) yang valid!";
        return;
    }

    // Deteksi Kelas IP berdasarkan Oktet Pertama
    let firstOctet = parseInt(ipInput.split('.')[0]);
    let kelasIP = "Tidak Diketahui / IP Khusus";
    
    if (firstOctet >= 1 && firstOctet <= 126) kelasIP = "Kelas A";
    else if (firstOctet === 127) kelasIP = "Loopback Address (Lokal)";
    else if (firstOctet >= 128 && firstOctet <= 191) kelasIP = "Kelas B";
    else if (firstOctet >= 192 && firstOctet <= 223) kelasIP = "Kelas C";
    else if (firstOctet >= 224 && firstOctet <= 239) kelasIP = "Kelas D (Multicast)";
    else if (firstOctet >= 240 && firstOctet <= 254) kelasIP = "Kelas E (Eksperimen)";

    // Hitung Jumlah Host
    let jumlahHost = Math.pow(2, (32 - cidr)) - 2;
    let hostValid = jumlahHost < 0 ? 0 : jumlahHost;
    let totalIP = Math.pow(2, (32 - cidr));

    document.getElementById('hasilSubnet').innerHTML = `
        <strong>Hasil Analisis Jaringan:</strong><br>
        • Klasifikasi Jaringan : ${kelasIP}<br>
        • Jumlah Host Valid    : ${hostValid.toLocaleString('id-ID')} IP Address<br>
        • Total Alokasi IP     : ${totalIP.toLocaleString('id-ID')} (Termasuk Net & Broadcast)
    `;
}

// Fitur 2: Cisco Config Generator
function generateConfig() {
    let namaInt = document.getElementById('intName').value || "GigabitEthernet0/0";
    let ip = document.getElementById('ipAddress').value || "192.168.1.1";
    let mask = document.getElementById('netmask').value || "255.255.255.0";

    let scriptCisco = `enable
configure terminal
interface ${namaInt}
 ip address ${ip} ${mask}
 no shutdown
 exit
end
write memory`;

    document.getElementById('hasilConfig').innerText = scriptCisco;
}
async function cekKoneksiDetail() {
    let targetHasil = document.getElementById('hasilDiagnostik');
    targetHasil.innerHTML = "<em>Sedang memeriksa jaringan, mohon tunggu...</em>";

    // TAHAP 1: Cek Koneksi Fisik / Perangkat (Kabel LAN atau WiFi ke Router)
    if (!navigator.onLine) {
        targetHasil.innerHTML = `
            <strong style="color: #e74c3c;">❌ KESALAHAN: KABEL ATAU WIFI TERPUTUS</strong><br><br>
            • <strong>Analisis:</strong> Laptop/HP Anda tidak terhubung ke jaringan lokal sama sekali.<br>
            • <strong>Solusi:</strong> Periksa apakah kabel LAN terpasang kencang, atau pastikan WiFi HP/Laptop Anda sudah menyala dan terhubung ke Router.
        `;
        return;
    }

    // TAHAP 2: Cek Akses ke Internet (Menguji Ping ke Server Publik)
    // Kita gunakan teknik fetch ke IP DNS publik Google/Cloudflare secara ringan
    try {
        // Melakukan request ringan ke endpoint CORS-free atau favicon publik
        let response = await fetch('https://httpbin.org', { mode: 'no-cors', cache: 'no-store' });
        
        // TAHAP 3: Jika Internet Hidup, Cek Apakah Server Tertentu yang Bermasalah
        targetHasil.innerHTML = `
            <strong style="color: #2ecc71;">✅ JARINGAN NORMAL: INTERNET AKTIF</strong><br><br>
            • <strong>Analisis:</strong> Kabel/WiFi aman, dan jalur internet ke luar negeri/ISP berjalan lancar.<br>
            • <strong>Info Tambahan:</strong> Jika Anda tetap tidak bisa membuka web tertentu (misal: Facebook/YouTube), kemungkinan besar **Server aplikasi tersebut yang sedang tumbang/down**, bukan internet Anda yang rusak.
        `;
    } catch (error) {
        // Jika tahap 1 lolos (terhubung ke router) tapi tahap 2 gagal (tidak bisa akses server luar)
        targetHasil.innerHTML = `
            <strong style="color: #f39c12;">⚠️ KESALAHAN: JALUR ISP/INTERNET TERGANGGU</strong><br><br>
            • <strong>Analisis:</strong> Perangkat Anda sukses terhubung ke Router (Kabel/WiFi aman), tetapi Router tidak mendapatkan pasokan internet dari operator/ISP.<br>
            • <strong>Solusi:</strong> Masalah ada di pusat operator (IndiHome, Biznet, Telkomsel, dll). Silakan restart modem Router Anda, atau hubungi call center provider internet Anda.
        `;
    }
}

