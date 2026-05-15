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

