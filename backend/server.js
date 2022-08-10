const express = require("express");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.get("/", (req, res) => {
  res.send("This is realitime mern app");
});

let roomIdGlobal;

io.on("connection", (socket) => {
  console.log("User connecteddd");

  socket.on("userJoined", (roomData) => {
    const { roomId, userId } = roomData;
    console.log(roomId);
    roomIdGlobal = roomId;
    socket.join(roomId);
    console.log(io.sockets.adapter.rooms);

    socket.emit("userIsJoined", { success: true });
  });

  socket.on("drawing", (x) => {
    socket.broadcast.emit("lineDrew", x);
  });

  socket.on("disconnect", () => {
    console.log(io.sockets.adapter.rooms);
    console.log("user disconnected");
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log("SERVER IS RUNNING ON PORT 5000"));
