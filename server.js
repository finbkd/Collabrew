// const url = require("url");

require("dotenv").config();
const express = require("express");
const app = express();

const path = require("path");

const server = require("http").createServer(app);
const io = require("socket.io")(server);

let roomIdGlobal;

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// app.use(express.static(path.join(__dirname, "/client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/client/build", "index.html"));
// });

io.on("connection", (socket) => {
  console.log("User connecteddd");
  console.log(io.sockets.adapter.rooms);

  socket.on("join room", (id) => {
    socket.to(roomIdGlobal).emit("user-joined", id);
  });

  socket.on("userJoined", (roomData) => {
    // console.log(roomData);
    if (!roomData) return;
    const { roomId, userId } = roomData;
    roomIdGlobal = roomId;
    socket.join(roomId);
    socket.to(roomIdGlobal).emit("otherUserJoined", roomData);
  });

  socket.on("call the other user", (id) => {
    socket.to(roomIdGlobal).emit("call the other user", id);
  });

  socket.on("status_online", () => {
    socket.broadcast.emit("status_changed");
  });

  socket.on("drawing", (x) => {
    socket.to(roomIdGlobal).emit("lineDrew", x);
  });

  socket.on("messageSend", (msg) => {
    socket.to(roomIdGlobal).emit("messageDelivered", msg);
  });

  socket.on("disconnect", () => {
    console.log(io.sockets.adapter.rooms);
    console.log("user disconnected");
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log("SERVER IS RUNNING ON PORT 5000"));
