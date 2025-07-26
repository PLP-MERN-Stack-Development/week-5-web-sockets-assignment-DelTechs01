const messages = [];

module.exports = {
  addMessage: (msg) => messages.push(msg),
  getMessages: (room, page, limit) => {
    const start = page * limit;
    return messages.filter((m) => m.room === room).slice(start, start + limit);
  },
};