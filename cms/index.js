// express menyedakan fungsi untuk membuat server
const express = require('express');

// mongoose library untuk javascript menyediakan fungsi untuk menghubungkan ke database MongoDB
const mongoose = require('mongoose');

// cors menyediakan fungsi untuk mengatur CORS
const cors = require('cors');

// Inisialisasi aplikasi Express
// semua fitur di express bisa diakses melalui variabel app
const app = express();

// Mengatur parsing body dari request menjadi JSON
// agar bisa diakses melalui variabel req.body
app.use(express.json());
app.use(cors());

// Menghubungkan ke database MongoDB menggunakan Mongoose
mongoose.connect('mongodb+srv://pabw:pabw@sistemmanajemenkonten-p.hbldkvq.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Terhubung ke MongoDB');
  })
  .catch((error) => {
    console.error('Kesalahan saat menghubungkan ke MongoDB:', error);
  });

// Membuat schema artikel
// schema adalah struktur dari tabel
// schema ini akan digunakan untuk membuat model
const artikelSchema = new mongoose.Schema({
  konten: String,
  judul: String,
  tanggal: Date,
  slug: String,
});

// Membuat model Artikel berdasarkan schema
// model adalah referensi tabel, kalau ingin akses tabel gunakan model
const Artikel = mongoose.model('Artikel', artikelSchema);

// Membuat artikel baru
app.post('/artikel', (req, res) => {
  // mengambil konten, judul, tanggal, dan slug dari body request
  const { konten, judul, tanggal, slug } = req.body;

  // membuat artikel baru
  // fungsi create datang dari mongoose, gunananya untuk membuat data baru
  Artikel.create({
    konten,
    judul,
    tanggal,
    slug,
  }) // jika artikel sudah dibuat maka akan menjalankan kode didalam then
    // artikel adalah data yang sudah dibuat,   
  .then((artikel) => {
      // kode ini untuk mengirimkan respon ke client
      // respon 201 adlalah respon untuk "data berhasil dibuat"
      res.status(201).json(artikel);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Gagal membuat artikel' });
    });
});

// Membaca satu artikel berdasarkan slug
app.get('/artikel/:slug', (req, res) => {
  const slug = req.params.slug;

  // findone adalah fungsi untuk mencari satu data
  // cari artikel berdasarkan atribut slug nya
  Artikel.findOne({ slug })
    .then((artikel) => {
      if (artikel) {
        res.json(artikel);
      } else {
        res.status(404).json({ error: 'Artikel tidak ditemukan' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Gagal membaca artikel' });
    });
});

// Membaca semua artikel
app.get('/artikel', (req, res) => {
  // fungsi find datang dari mongoose, gunanya untuk mencari semua data 
  Artikel.find().then((artikel) => {
      res.json(artikel);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Gagal membaca artikel' });
    });
});

// Menghapus artikel
app.delete('/artikel/:slug', (req, res) => {
  const slug = req.params.slug;

  // fungsi akan menemukan artikel berdasarkan slug
  // lalu menghapus artikel tersebut
  Artikel.findOneAndDelete({ slug })
    .then((artikel) => {
      if (artikel) {
        res.json({ message: 'Artikel berhasil dihapus' });
      } else {
        res.status(404).json({ error: 'Artikel tidak ditemukan' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Gagal menghapus artikel' });
    });
});

// Mengedit artikel
app.put('/artikel/:slug', (req, res) => {
  const slug = req.params.slug;
  // ambil konten, judul, dan tanggal dari body request
  // ini adalah data baru yang akan menggantikan data lama
  // const { konten, judul, tanggal } = req.body;
  const konten = req.body.konten;
  const judul = req.body.judul;
  const tanggal = req.body.tanggal;

  Artikel.findOneAndUpdate(
    { slug },
    { konten, judul, tanggal },
    { new: true }
  )
    .then((artikel) => {
      if (artikel) {
        res.json(artikel);
      } else {
        res.status(404).json({ error: 'Artikel tidak ditemukan' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Gagal mengedit artikel' });
    });
});

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});