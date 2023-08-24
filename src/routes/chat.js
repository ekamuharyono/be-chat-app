// routes/chat.js
const express = require('express');
const dotenv = require('dotenv').config()
const io = require('socket.io')()
const router = express.Router();
const Message = require('../models/message');

const jwtSecret = process.env.JWT_SCREETKEY


// function ensureAuthenticated(req, res, next) {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (err || !user) {
//       return res.status(401).json({ message: 'Harap masuk untuk mengakses' });
//     }
//     req.user = user; // Menyimpan informasi pengguna yang terotentikasi
//     return next();
//   })(req, res, next);
// }

router.post('/send', async (req, res) => {
  const { message } = req.body;
  const { username } = req.user

  if (!message) {
    return res.status(400).json({ error: 'Konten pesan harus diisi' });
  }

  try {
    const newMessage = new Message({
      from: username,
      to: 'daya',
      text: message
    });
    await newMessage.save();
    res.json({ message: 'Pesan berhasil dikirim' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengirim pesan' });
  }
});

router.get('/messages', async (req, res) => {
  const { user1, user2 } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { participant: [user1, user2] },
        { participant: [user2, user1] },
      ]
    }).sort('-timestamp');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil pesan' });
  }
});

module.exports = router;