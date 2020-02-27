const express = require("express");
const router = express.Router();
const Chat = require("../schemas/chat");

router.post("/addChat", async (req, res) => {
  try {
    const chat = new Chat({
      message: req.body.chat.message,
      author: req.body.chat.author,
      createdAt: req.body.chat.createdAt,
      room_id: req.body.chat.room_id
    });
    const result = await chat.save();
    Chat.populate(result, { path: "author" });
    res.send();
  } catch (err) {
    console.log(err);
  }
});

router.post("/getChats", async (req, res) => {
  try {
    const chats = await Chat.find({ room_id: req.body.room_id }).populate(
      "author"
    );
    res.json({ chats });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
