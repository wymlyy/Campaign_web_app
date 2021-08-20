const express = require("express");
const router = express.Router();
const { Signatures } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body;
  const UserId = req.user.id;

  const found = await Signatures.findOne({
    where: { PostId: PostId, UserId: UserId },
  });
  if (!found) {
    await Signatures.create({ PostId: PostId, UserId: UserId });
    res.json({ signed: true });
  } else {
    await Signatures.destroy({
      where: { PostId: PostId, UserId: UserId },
    });
    res.json({ signed: false });
  }
});

module.exports = router;