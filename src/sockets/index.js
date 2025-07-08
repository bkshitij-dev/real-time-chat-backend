const { Server } = require("socket.io");

let io;

function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // JOIN ROOM HANDLER
    socket.on("join", (sessionId) => {
      socket.join(sessionId);
      console.log(`Socket ${socket.id} joined session ${sessionId}`);
    });

    socket.on("message:send", (message) => {
      const { sessionId, content, senderId, senderType } = message;

      if (!sessionId || !content || !senderId || !senderType) {
        socket.emit("error", { message: "Invalid message payload." });
        return console.warn("Invalid message format", message);
      }

      console.log(`Message from ${senderType} (${senderId}) in session ${sessionId}: ${content}`);

      // Broadcast to everyone in room (including sender for now)
      io.to(sessionId).emit("message:receive", {
        sessionId,
        content,
        senderId,
        senderType,
        timestamp: new Date().toISOString(),
      });
    });


    socket.on("ping", () => {
      console.log("Received 'ping' from client");
      socket.emit("pong");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = setupSocket;
