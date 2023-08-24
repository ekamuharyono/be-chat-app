const express = require('express');
const app = express();
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth')
const searchRoutes = require('./routes/search')
const Message = require('./models/message');

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: process.env.FRONTEND_URL
  }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('message', async (data) => {
    // console.log(data.socketID)
    try {
      const newMessage = new Message({
        sender: data.from,
        receiver: data.to,
        text: data.text,
        participant: [data.from, data.to]
      });
      await newMessage.save();
      socketIO.emit(`messageTo${data.to}`, data);
    } catch (error) {
      res.status(500).json({ error: 'Gagal mengirim pesan' });
    }
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

// Rute root
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di Chat App API' });
});

app.use('/auth', authRoutes)

app.use('/chat', chatRoutes);

app.use('/search', searchRoutes)

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

