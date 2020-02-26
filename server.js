const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const roomRouter = require("./routes/roomRouter");

const connect = require("./schemas");
const User = require("./schemas/user");
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

// Current Users
let users = [];

// Chat Connection
io.on("connection", socket => {
  console.log("Socket Connected!!");
  console.log(`User Connected with id: ${socket.client.id}`);
  console.log("--------------------------------");

  //   console.log(socket.id);
  socket.on("JOIN", async ({ username, roomCode }) => {
    socket.join(roomCode);
    console.log(roomCode);

    const joinMessage = {
      name: "Admin",
      message: `${username} has joined!`,
      createdAt: ""
    };
    socket.broadcast.to(roomCode).emit("RECEIVE", joinMessage);

    // Make room user list //
    const user = await User.find({ name: username });
    const userObj = { id: socket.id, name: user[0].name, room: roomCode };
    users.push(userObj); // add new socket user
    io.to(roomCode).emit("ROOMUSERS", users);
    // ------------------ //
  });

  socket.on("SEND", data => {
    io.to(data.roomCode).emit("RECEIVE", data);
    console.log(data);
    console.log(
      `===========message send to everyone in ${data.roomCode}============`
    );
  });

  socket.on("EXIT", function(roomCode) {
    socket.leave(roomCode);
    io.to(roomCode).emit("RECEIVE", { message: "user disconnected" });
  });

  socket.on("disconnect", () => {
    console.log(`disconnected!: ${socket.client.id}`);

    const removeUser = id => {
      const index = users.findIndex(user => user.id === id);

      if (index !== -1) {
        return users.splice(index, 1)[0];
      }
    };

    const user = removeUser(socket.client.id);
    if (user) {
      users = users.filter(user => user.id !== socket.client.id);
      io.to(user.room).emit("ROOMUSERS", users);

      io.emit("RECEIVE", { message: "A user has left and disconnected!" });
    }
  });
});

// Web Server
const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`------Server running on port ${port}------`);
});
