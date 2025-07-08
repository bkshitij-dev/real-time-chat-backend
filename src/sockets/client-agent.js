const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

const sessionId = "abc123";

socket.on("connect", () => {
  console.log("Agent connected:", socket.id);
  socket.emit("join", sessionId);
});

socket.on("message:receive", (msg) => {
  console.log("Agent received:", msg);
});

setTimeout(() => {
  socket.emit("message:send", {
    sessionId,
    senderId: "agent001",
    senderType: "agent",
    content: "Hello from agent!",
  });
}, 3000);
