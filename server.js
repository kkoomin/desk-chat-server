const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const connect = require("./schemas");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(cors());

app.use("/user", userRouter);
app.use("/chat", chatRouter);

// DB Connection
connect();

// Chat Connection
io.on("connection", socket => {
  console.log("Socket Connected!!");

  socket.on("SEND", data => {
    io.emit("RECEIVE", data);
    console.log("message send to everyone");
  });
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`------Server running on port ${port}`);
});
