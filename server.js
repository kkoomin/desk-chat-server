const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const roomRouter = require("./routes/roomRouter");

const cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socketio(server);

const socketController = require("./socketController.js");

// const DB = process.env.DATABASE.replace(
//   "<password>",
//   process.env.DATABASE_PASSWORD
// );
const DB = process.env.DATABASE_LOCAL;

// DB Connection
const connectDB = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }
  mongoose.connect(
    DB,
    {
      dbName: "desk-chat",
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    },
    error => {
      if (error) {
        console.log("MongoDB connection lost", error);
      } else {
        console.log("MongoDB Connected! 😁");
      }
    }
  );
};

connectDB();

// Control DB Connection Error
mongoose.connection.on("error", error => {
  console.error("MongoDB connection error : ", error);
});
mongoose.connection.on("disconnected", () => {
  console.error("MongoDB connection lost, retry connect.");
  connectDB();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routers
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/room", roomRouter);

// Chat Connection
io.on("connection", socket => {
  socketController(socket, io);
});

// Web Server
const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`------Server running on port ${port}------`);
});
