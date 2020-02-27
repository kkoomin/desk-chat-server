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
    const user = new User({
      email: req.body.user.email,
      password: req.body.user.password,
      name: req.body.user.name
    });
    await user.save();
    res.json({ message: "✅ 회원가입 되었습니다." });
  } catch (err) {
    console.error(err);
    res.json({ message: "❌ 회원가입에 실패했습니다." });
  }
});

module.exports = router;
