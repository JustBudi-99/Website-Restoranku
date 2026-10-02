const API_URL = 'http://localhost:3000/api/menu';
let dataSemuaMenu = [];
let kategoriAktif = 'Semua';

// Placeholder gambar otomatis jika di DB nilainya NULL
const defaultImages = {
    'Makanan': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
    'Minuman': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80'
};

async function ambilDataMenu() {
    const container = document.getElementById('daftar-menu');

    try {
        const response = await axios.get(API_URL);
        dataSemuaMenu = Array.isArray(response.data) ? response.data : (response.data.data || []);
        tampilkanMenu(dataSemuaMenu);
    } catch (error) {
        console.error('Error fetching data:', error);
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <span class="text-4xl">⚠️</span>
                <p class="text-red-500 font-semibold mt-2">Gagal terhubung ke server API.</p>
                <p class="text-gray-500 text-sm">Pastikan server Node.js sudah dinyalakan.</p>
            </div>
        `;
    }
}

function tampilkanMenu(items) {
    const container = document.getElementById('daftar-menu');

    if (items.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                <span class="text-4xl">🔍</span>
                <p class="mt-2 text-lg">Menu tidak ditemukan.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => {
        const hargaFormatted = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(item.harga);

        // Pilih gambar dari database atau gambar default berdasarkan kategori
        const gambarUrl = item.gambar || defaultImages[item.kategori] || 'https://via.placeholder.com/400x300';
        const isMakanan = item.kategori === 'Makanan';

        return `
            <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between group">
                <div>
                    <!-- Container Gambar dengan Hover Zoom Effect -->
                    <div class="relative h-48 overflow-hidden bg-gray-100">
                        <img src="${gambarUrl}" alt="${item.nama}" 
                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <!-- Badge Kategori -->
                        <span class="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                            isMakanan ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }">
                            ${item.kategori}
                        </span>
                    </div>

                    <!-- Detail Menu -->
                    <div class="p-5">
                        <h3 class="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">${item.nama}</h3>
                        <p class="text-gray-500 text-xs mt-1 leading-relaxed">Nikmati sajian khas favorit dengan resep rahasia restoran kami.</p>
                    </div>
                </div>

                <!-- Footer Card (Harga & Tombol Pesan) -->
                <div class="px-5 pb-5 pt-2 flex items-center justify-between border-t border-gray-50 mt-auto">
                    <div>
                        <span class="text-xs text-gray-400 block">Harga</span>
                        <span class="text-lg font-extrabold text-emerald-600">${hargaFormatted}</span>
                    </div>
                    <button onclick="pesanMenu('${item.nama}')" 
                        class="bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95">
                        + Pesan
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Fitur Filter Berdasarkan Kategori
function filterKategori(kategori) {
    kategoriAktif = kategori;
    
    // Update tampilan style tombol filter
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        if (btn.textContent.trim() === kategori) {
            btn.className = 'filter-btn bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md';
        } else {
            btn.className = 'filter-btn bg-white text-gray-600 hover:bg-emerald-50 px-5 py-2 rounded-full text-sm font-medium border transition-all';
        }
    });

    terapkanFilterDanCari();
}

// Fitur Pencarian Realtime
document.getElementById('search-input')?.addEventListener('input', (e) => {
    terapkanFilterDanCari(e.target.value);
});

function terapkanFilterDanCari(keyword = document.getElementById('search-input')?.value || '') {
    let hasil = dataSemuaMenu;

    if (kategoriAktif !== 'Semua') {
        hasil = hasil.filter(item => item.kategori === kategoriAktif);
    }

    if (keyword.trim() !== '') {
        hasil = hasil.filter(item => item.nama.toLowerCase().includes(keyword.toLowerCase()));
    }

    tampilkanMenu(hasil);
}

function pesanMenu(namaMenu) {
    alert(`Berhasil menambahkan "${namaMenu}" ke keranjang! 🛒`);
}

// Function Buka/Tutup Modal
function bukaModalTambah() {
    const modal = document.getElementById('modal-tambah');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function tutupModalTambah() {
    const modal = document.getElementById('modal-tambah');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.getElementById('form-tambah').reset();
}

// Function Submit Form Tambah Menu
async function tambahMenu(event) {
    event.preventDefault(); // Mencegah reload halaman dasar

    const nama = document.getElementById('input-nama').value;
    const kategori = document.getElementById('input-kategori').value;
    const harga = parseInt(document.getElementById('input-harga').value);
    const gambar = document.getElementById('input-gambar').value || null;

    try {
        const response = await axios.post(API_URL, {
            nama,
            kategori,
            harga,
            gambar
        });

        alert('✨ ' + response.data.message);
        tutupModalTambah();
        
        // Refresh daftar menu secara otomatis
        ambilDataMenu();

    } catch (error) {
        console.error('Gagal menambah menu:', error);
        alert(error.response?.data?.message || 'Gagal menambahkan menu!');
    }
}

document.addEventListener('DOMContentLoaded', ambilDataMenu);