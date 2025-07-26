const users = new Map();

module.exports = {
  addUser: (socketId, username) => users.set(socketId, { username, status: 'online' }),
  removeUser: (socketId) => users.delete(socketId),
  getUser: (socketId) => users.get(socketId),
  getUsers: () => Array.from(users.values()),
  findUserSocketId: (username) => {
    for (let [socketId, user] of users) {
      if (user.username === username) return socketId;
    }
    return null;
  },
};