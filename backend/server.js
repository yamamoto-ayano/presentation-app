const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 必要に応じて制限
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("stamp", (data) => {
    io.emit("stamp", data); // 全員にブロードキャスト
  });

  socket.on("clap", (data) => {
    io.emit("clap", data); // 全員にブロードキャスト
  });

  socket.on("ippon", (data) => {
    io.emit("ippon", data); // 全員にブロードキャスト
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("WebSocket server is running!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});