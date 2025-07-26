const socketController = require('../controllers/socketController');

module.exports = (io) => {
  socketController(io);
};