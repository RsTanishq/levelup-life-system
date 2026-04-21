const socketEvents = require("../constants/socketEvents");

const registerSockets = (io) => {
  io.on(socketEvents.CONNECTION, (socket) => {
    socket.on("disconnect", () => {});
  });
};

module.exports = { registerSockets };
