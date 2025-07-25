const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDB = require("./config/db");
const setupSocket = require("./sockets");
const authRoutes = require("./api/routes/auth.routes");
const testRoutes = require("./api/routes/test");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.status(200).send("OK"));

app.use("/api/auth", authRoutes);

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

setupSocket(server);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});