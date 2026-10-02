const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP biasanya kosong
    database: 'db_restoran' // Nama database kamu
});

db.connect((err) => {
    if (err) {
        console.error('Gagal konek ke database:', err.message);
    } else {
        console.log('Berhasil terhubung ke database MySQL db_restoran!');
    }
});

module.exports = db;