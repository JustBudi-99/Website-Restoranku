const express = require('express');
const cors = require('cors');

const app = express(); // 1. Inisialisasi 'app' HARUS di atas!

// 2. Baru pasang middleware
app.use(cors());
app.use(express.json());

// 3. Impor & gunakan routes
const menuRoutes = require('./routes/menuRoutes');
app.use('/api/menu', menuRoutes);

// 4. Jalankan server
app.listen(3000, () => {
    console.log('Server backend jalan di http://localhost:3000');
});