const express = require("express");
const http = require("http");
const cors = require("cors");


const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.status(200).send("OK"));

// Test Route
const testRoutes = require("./api/routes/test");
app.use("/api", testRoutes);11

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});