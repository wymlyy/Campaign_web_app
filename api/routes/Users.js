const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
    const { username, email, password, avatar } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            email: email,
            password: hash,
            avatar: avatar,
        });
        res.json("SUCCESS");
    });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: { username: username } });

    if (!user) res.json({ error: "User Doesn't Exist" });

    bcrypt.compare(password, user.password).then(async (match) => {
        if (!match) res.json({ error: "Wrong Username And Password Combination" });

        const accessToken = sign(
            { username: user.username, id: user.id },
            "importantsecret"
        );
        res.json({ token: accessToken, username: username, id: user.id });
    });
});

router.get("/verification", validateToken,  (req, res) => {

    res.json(req.user);
});

// router.get("/userInfo/:id", validateToken, async (req, res) => {  
//     const id = req.params.id;
  
//     const userInfo = await Users.findAll();
  
//     res.json(userInfo);
// });


router.get("/basicinfo/:id", async (req, res) => {
    const id = req.params.id;
  
    const basicInfo = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
  
    res.json(basicInfo);
});
  
router.put("/changepassword", validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findOne({ where: { username: req.user.username } });
  
    bcrypt.compare(oldPassword, user.password).then(async (match) => {
      if (!match) res.json({ error: "Wrong Password Entered!" });
  
      bcrypt.hash(newPassword, 10).then((hash) => {
        Users.update(
          { password: hash },
          { where: { username: req.user.username } }
        );
        res.json("SUCCESS");
      });
    });
});
  
router.put("/avatar", validateToken, async (req, res) => {
    const { newAvatar, username } = req.body;
    await Users.update({
      avatar: newAvatar,
    }, { where: { username: req.user.username } });
    res.json(newAvatar);
  });

module.exports = router;