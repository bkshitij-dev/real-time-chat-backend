require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.status(200).send("OK"));

const authRoutes = require("./api/routes/auth.routes");
app.use("/api/auth", authRoutes);

const testRoutes = require("./api/routes/test");
app.use("/api", testRoutes);

// Connect to MongoDB
connectDB();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n Gracefully shutting down...");
  await mongoose.disconnect();
  console.log("MongoDB connection closed.");
  process.exit(0);
});

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Basic socket connection test
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});