const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const roomRouter = require("./routes/roomRouter");

const connect = require("./schemas");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(cors());

// Routers
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/room", roomRouter);

// DB Connection
connect();

// Chat Connection
io.on("connection", socket => {
  console.log("Socket Connected!!");

  socket.on("JOIN", roomData => {
    // Join the room
    socket.join(roomData.room);
    // Welcome the user to the room
    // io.emit("RECEIVE", { data: "Welcome!" });
    // Broadcast an event to everyone in the room
    const joinMessage = {
      name: "Admin",
      message: `${roomData.username} has joined!`,
      createdAt: ""
    };
    socket.broadcast.to(roomData.room).emit("RECEIVE", joinMessage);

    socket.on("SEND", data => {
      io.to(roomData.room).emit("RECEIVE", data);
      console.log("===========message send to everyone============");
    });
  });
});

// Web Server
const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`------Server running on port ${port}------`);
});
