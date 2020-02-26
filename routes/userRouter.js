const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

router.post("/login", async (req, res) => {
  try {
    const user = await User.find({
      email: req.body.user.email,
      password: req.body.user.password
    });
    if (user.length > 0) {
      res.json({ status: true, message: user });
    } else {
      res.json({ status: false, message: "회원정보를 찾을 수 없습니다." });
    }
  } catch (err) {
    console.error(err);
    res.json({ message: false });
  }
});

router.post("/signup", async (req, res) => {
  try {
    console.log(req.body.user);
    const user = new User({
      email: req.body.user.email,
      password: req.body.user.password,
      name: req.body.user.name
    });
    const result = await user.save();
    res.json({ message: "✅ 회원가입 되었습니다." });
  } catch (err) {
    console.error(err);
    res.json({ message: "❌ 회원가입에 실패했습니다." });
  }
});

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const user = await User.findOne({ _id: req.params.id });
    user.room_id = null;
    await user.save();
    res.send();
  } catch (err) {
    console.error(err);
    res.json({ message: "로그아웃과 동시에 방에서 나갔습니다." });
  }
});

// router.post("/updateUserRoom", async (req, res) => {
//   // console.log(`-----${req.body.userId} + ${req.body.roomId}`);
//   try {
//     const user = await User.findOne({ _id: req.body.userId });
//     user.room_id = req.body.roomId;
//     console.log(user);
//     await user.save();
//   } catch (err) {
//     console.error(err);
//     res.json({ message: "방 입장에 실패했습니다." });
//   }
// });

// router.post("/getRoomUsers", async (req, res) => {
//   try {
//     const users = await User.find({ room_id: req.body.roomId }, { name: 1 });
//     res.json({ users });
//   } catch (err) {
//     console.error(err);
//     res.json({ status: false });
//   }
// });

module.exports = router;
