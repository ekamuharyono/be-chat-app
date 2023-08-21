const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

const dbURL = process.env.MONGODB_URL;

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Terhubung ke database MongoDB');
  })
  .catch(err => {
    console.error('Koneksi ke database gagal:', err);
  });

module.exports = mongoose;