const express = require('express');
const app = express();
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth')
const Message = require('./models/message');

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:5173"
  }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
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

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

