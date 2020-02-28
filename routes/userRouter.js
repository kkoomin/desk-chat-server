const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

router.post("/login", async (req, res) => {
  try {
    const user = await User.find(
      {
        email: req.body.user.email,
        password: req.body.user.password
      },
      { _id: 1, name: 1, email: 1 }
    );
    if (user.length > 0) {
      res.json({ status: true, message: user });
    } else {
      res.json({ status: false, message: "회원정보를 찾을 수 없습니다." });
    }
  } catch (err) {
    console.error(err);
    res.json({ message: "회원정보를 찾을 수 없습니다." });
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

router.post("/deleteUser", async (req, res) => {
  try {
    await User.deleteOne({
      name: req.body.username
    });
    res.json({ message: "😢 탈퇴되었습니다. 다음에 또 만나요!" });
  } catch (err) {
    console.error(err);
    res.json({ message: "❌ 회원 삭제에 실패했습니다." });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const user = await User.find(
      {
        name: req.params.username
      },
      { _id: 1, name: 1, email: 1 }
    );
    res.json({ status: true, user: user[0] });
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: "❌ 회원정보를 찾을 수 없습니다." });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const user = await User.updateOne(
      {
        _id: req.params.id
      },
      { $set: { password: req.body.password, name: req.body.name } }
    );
    res.json({ status: true, message: "✅ 회원정보가 수정되었습니다!" });
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: "❌ 회원정보 수정에 실패했습니다." });
  }
});

module.exports = router;
