const express = require("express");
const router = express.Router();
const Room = require("../schemas/room");

router.post("/getRoom", async (req, res) => {
  try {
    console.log(req.body.roomData);

    if (req.body.roomData.title) {
      const room = new Room({
        title: req.body.roomData.title,
        code: req.body.roomData.code
      });
      const result = await room.save();
      res.json({ status: true, room });
    } else {
      const room = await Room.find({
        code: req.body.roomData.code
      });
      if (room.length > 0) {
        res.json({ status: true, room: room[0] });
      } else {
        res.json({ status: false, message: "방 정보를 찾을 수 없습니다." });
      }
    }
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: "방을 생성할 수 없습니다." });
  }
});

router.get("/:roomCode", async (req, res) => {
  try {
    const room = await Room.find(
      {
        code: req.params.roomCode
      },
      { title: 1 }
    );
    res.json(room[0]);
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
});

module.exports = router;
