const express = require("express");
const router = express.Router();
const Chat = require("../schemas/chat");

router.post("/addChat", async (req, res) => {
  try {
    // console.log(req.body.chat);
    const chat = new Chat({
      message: req.body.chat.message,
      author: req.body.chat.author
      //   room_id: req.body.chat.room_id
    });
    const result = await chat.save();
    Chat.populate(result, { path: "author" });
    console.log(result);
    // res.json({ message: "메세지 저장성공" });
    res.send();
  } catch (err) {
    console.log(err);
  }
});

router.get("/getChats", async (req, res) => {
  try {
    const chats = await Chat.find({}).populate("author");
    res.json({ chats });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
