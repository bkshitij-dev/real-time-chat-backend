const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);
  console.log("Client says ping!");
  socket.emit("ping");
});

socket.on("pong", () => {
  console.log("Server says pong!");
});

socket.on("disconnect", () => {
  console.log("Disconnected");
});
