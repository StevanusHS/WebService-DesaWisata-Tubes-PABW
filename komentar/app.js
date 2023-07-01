const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');

// Mengatur parsing body dari request menjadi JSON
app.use(express.json());
app.use(cors());

// Mongoose Schema for Komentar
const komentarSchema = new mongoose.Schema({
  konten: { type: String, required: true },
  nama: { type: String, required: true },
  tanggal: { type: Date, default: Date.now },
  idArtikel: { type: String, required: true },
});

// Mongoose Model for Komentar
const Komentar = mongoose.model("Komentar", komentarSchema);

// Connecting to MongoDB using Mongoose
mongoose
  .connect(
    "mongodb+srv://hanif:APASI123@komentarapi.eqwl6k4.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  ) 
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Create a new Komentar
app.post("/komentar", (req, res) => {
  const { konten, nama, idArtikel } = req.body;
  console.log(req.body)
  const komentar = new Komentar({ konten, nama, idArtikel });

  komentar
    .save()
    .then(() => {
      res.status(201).json({ message: "Komentar created successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: `Failed to create komentar: ${error.message}` });
      console.log(error.message)
    });
});

// Read all Komentar
app.get("/komentar", (req, res) => {
  Komentar.find()
    .then((komentar) => {
      res.json(komentar);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to read komentar" });
    });
});

// Read komentar berdasarkan idArtikel
app.get('/komentar/:idArtikel', (req, res) => {
  Komentar.find({idArtikel: req.params.idArtikel})
    .then(komentar => {
      res.json(komentar);
    })
    .catch(err => {
      res.json(err);
    });
});

// Delete a Komentar
app.delete("/komentar/:id", (req, res) => {
  const { id } = req.params;

  Komentar.findByIdAndDelete(id)
    .then((komentar) => {
      if (!komentar) {
        res.status(404).json({ error: "Komentar not found" });
      } else {
        res.json({ message: "Komentar deleted successfully" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to delete komentar" });
    });
});

// Edit a Komentar
app.put("/komentar/:id", (req, res) => {
  const { id } = req.params;
  const { konten, nama, idArtikel } = req.body;

  Komentar.findByIdAndUpdate(id, { konten, nama, idArtikel }, { new: true })
    .then((komentar) => {
      if (!komentar) {
        res.status(404).json({ error: "Komentar not found" });
      } else {
        res.json({ message: "Komentar updated successfully" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update komentar" });
    });
});

// Start the server on port 3001
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});