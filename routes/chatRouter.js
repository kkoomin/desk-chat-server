const express = require("express");
const router = express.Router();
const Chat = require("../schemas/chat");

router.post("/addChat", async (req, res) => {
  try {
    console.log(req.body.chat);
    const chat = new Chat({
      content: req.body.chat.content,
      author: req.body.chat.author
    });
    const result = await chat.save();
    res.json({ message: "✅ 회원가입 되었습니다." });
  } catch (err) {}
});

router.get("/getChats", async (req, res) => {
  try {
  } catch (err) {}
});

module.exports = router;
