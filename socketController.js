const User = require("./schemas/user");

const socketController = (socket, io, users) => {
  console.log("Socket Connected!!");
  console.log(`User Connected with id: ${socket.client.id}`);
  console.log("--------------------------------");

  socket.on("JOIN", async ({ username, roomCode }) => {
    socket.join(roomCode);

    const getRoomUsers = roomCode => {
      return users.filter(user => user.room === roomCode);
    };

    // Make room user list //
    const user = await User.find({ name: username });
    const userObj = { id: socket.id, name: user[0].name, room: roomCode };
    users.push(userObj); // add new socket user
    console.log(users);
    io.to(roomCode).emit("ROOMUSERS", getRoomUsers(roomCode));
    // ------------------ //
  });

  socket.on("SEND", data => {
    io.to(data.roomCode).emit("RECEIVE", data);
  });

  socket.on("EXIT", function(roomCode) {
    socket.leave(roomCode);
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
    }
  });
};

module.exports = socketController;
