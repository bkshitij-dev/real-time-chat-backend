const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

const sessionId = "abc123";
const senderType = "agent";
const senderId = "agent001";

socket.on("connect", () => {
  console.log("Agent connected:", socket.id);
  socket.emit("join", { sessionId, senderType, senderId });
});

socket.on("message:receive", (msg) => {
  const isSelf = msg.senderId === "agent001";
  if (isSelf) {
    console.log("Agent sent:", msg);
  } else {
    console.log("Agent received:", msg);
  }
});

socket.on("message:ack", (data) => {
  console.log("Server acknowledged message:", data);
});


setTimeout(() => {
  socket.emit("message:send", {
    sessionId,
    senderId: "agent001",
    senderType: "agent",
    content: "Hello from agent!",
  });
}, 3000);
