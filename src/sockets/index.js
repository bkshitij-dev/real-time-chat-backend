const { Server } = require("socket.io");

const Message = require("../models/message.model");

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

    socket.on("message:send", async (message) => {
      const { sessionId, content, senderId, senderType } = message;

      if (!sessionId || !content || !senderId || !senderType) {
        socket.emit("error", { message: "Invalid message payload." });
        return console.warn("Invalid message format", message);
      }

      console.log(`Message from ${senderType} (${senderId}) in session ${sessionId}: ${content}`);

      try {
        const savedMessage = await Message.create({
          sessionId,
          content,
          senderId,
          senderType,
          status: "delivered",
        });

        const payload = {
          sessionId,
          content,
          senderId,
          senderType,
          timestamp: savedMessage.createdAt,
        };
      
      // Send to all clients in room
      io.to(sessionId).emit("message:receive", payload);

      // Acknowledge to sender
      socket.emit("message:ack", {
        messageId: savedMessage._id,
        status: "delivered",
      });
    } catch (err) {
      console.error("DB Error while saving message:", err);
      socket.emit("message:error", { message: "Message could not be saved." });
    }
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
