const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

const sessionId = "abc123";
const senderType = "visitor";
const senderId = "visitor001";

socket.on("connect", () => {
  console.log("Visitor connected:", socket.id);
  socket.emit("join", { sessionId, senderType, senderId });
});

socket.on("message:receive", (msg) => {
  const isSelf = msg.senderId === "visitor001";
  if (isSelf) {
    console.log("Visitor sent:", msg);
  } else {
    console.log("Visitor received:", msg);
  }
});

socket.on("message:ack", (data) => {
  console.log("Server acknowledged message:", data);
});


setTimeout(() => {
  socket.emit("message:send", {
    sessionId,
    senderId: "visitor001",
    senderType: "visitor",
    content: "Hello from visitor!",
  });
}, 1000);
