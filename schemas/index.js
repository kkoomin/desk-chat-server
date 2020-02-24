const mongoose = require("mongoose");

module.exports = () => {
  const connect = () => {
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }
    mongoose.connect(
      "mongodb://localhost:27017/desk-chat",
      { dbName: "desk-chat" },
      err => {
        if (err) {
          console.log("MongoDB connection lost", error);
        } else {
          console.log("MongoDB Connected! 😁");
        }
      }
    );
  };

  connect();

  mongoose.connection.on("error", err => {
    console.error("MongoDB connection error : ", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.error("MongoDB connection lost, retry connect.");
    connect();
  });

  require("./user");
};
