const { addMessage, getMessages } = require('../models/Message');
const { addUser, removeUser, getUser, getUsers, findUserSocketId } = require('../utils/auth');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', (username) => {
      addUser(socket.id, username);
      socket.join('global');
      io.to('global').emit('notification', { message: `${username} joined the chat` });
      io.emit('userStatus', { users: getUsers() });
    });

    socket.on('message', ({ room, message }, callback) => {
      const user = getUser(socket.id);
      const msg = {
        id: Date.now(),
        sender: user.username,
        content: message,
        room,
        timestamp: new Date().toISOString(),
      };
      addMessage(msg);
      io.to(room).emit('message', msg);
      io.to(room).emit('notification', { message: `New message from ${user.username}` });
      callback({ status: 'delivered', id: msg.id });
    });

    socket.on('privateMessage', ({ to, message }) => {
      const user = getUser(socket.id);
      const toSocketId = findUserSocketId(to);
      if (toSocketId) {
        const msg = {
          id: Date.now(),
          sender: user.username,
          content: message,
          room: 'private',
          timestamp: new Date().toISOString(),
          private: true,
        };
        socket.to(toSocketId).emit('message', msg);
        socket.emit('message', msg);
      }
    });

    socket.on('file', ({ room, file, filename }) => {
      const user = getUser(socket.id);
      const msg = {
        id: Date.now(),
        sender: user.username,
        content: file,
        filename,
        type: 'file',
        room,
        timestamp: new Date().toISOString(),
      };
      addMessage(msg);
      io.to(room).emit('message', msg);
    });

    socket.on('typing', ({ room, username }) => {
      socket.to(room).emit('typing', { username });
    });

    socket.on('joinRoom', (room) => {
      socket.join(room);
      socket.emit('message', {
        id: Date.now(),
        sender: 'System',
        content: `Joined room ${room}`,
        room,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('loadMessages', ({ room, page, limit }) => {
      const messages = getMessages(room, page, limit);
      socket.emit('messages', messages);
    });

    socket.on('disconnect', () => {
      const user = getUser(socket.id);
      if (user) {
        removeUser(socket.id);
        io.to('global').emit('notification', { message: `${user.username} left the chat` });
        io.emit('userStatus', { users: getUsers() });
      }
    });
  });
};