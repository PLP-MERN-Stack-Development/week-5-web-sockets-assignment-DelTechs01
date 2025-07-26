const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketHandler = require('./socket/socket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Updated to match client port
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: 'http://localhost:5173' })); // Updated CORS for Express
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chat Server Running');
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});