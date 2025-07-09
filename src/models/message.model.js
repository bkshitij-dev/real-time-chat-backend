const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    ref: "Session",
    required: true,
    index: true,
  },
  senderId: {
    type: String,
    ref: "User",
    required: true,
  },
  senderType: {
    type: String,
    enum: ["agent", "visitor"],
    required: true,
  },
  content: {
    type: String,
    required: [true, "Message content is required."],
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "failed"],
    default: "sent",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;