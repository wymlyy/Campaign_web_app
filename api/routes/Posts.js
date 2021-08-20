const express = require('express');
const router = express.Router();
const { Posts, Signatures } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");



router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Signatures] });
  const signedPosts = await Signatures.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts.reverse(), signedPosts: signedPosts });
});

router.get("/visitors", async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Signatures] });
  const signedPosts = await Signatures.findAll();
  res.json({ listOfPosts: listOfPosts.reverse(), signedPosts: signedPosts });
});

router.get('/byId/:id', async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});



router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.username = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED");
});

// router.put("/:postId", validateToken, async (req, res) => {

//   try {
//     const updatedPost = await Post.findByIdAndUpdate(
//       req.params.postId,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedPost);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// }

// );

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({
    title: newTitle,
  }, { where: { id: id } });
  res.json(newTitle);
});

router.put("/topic", validateToken, async (req, res) => {
  const { newTopic, id } = req.body;
  await Posts.update({
    topic: newTopic,
  }, { where: { id: id } });
  res.json(newTopic);
});

router.put("/location", validateToken, async (req, res) => {
  const { newLocation, id } = req.body;
  await Posts.update({
    location: newLocation,
  }, { where: { id: id } });
  res.json(newLocation);
});

router.put("/startDate", validateToken, async (req, res) => {
  const { newStartDate, id } = req.body;
  await Posts.update({
    startDate: newStartDate,
  }, { where: { id: id } });
  res.json(newStartDate);
});

router.put("/username", validateToken, async (req, res) => {
  const { newUsername, id } = req.body;
  await Posts.update({
    username: newUsername,
  }, { where: { id: id } });
  res.json(newUsername);
});

router.put("/postText", validateToken, async (req, res) => {
  const { newPostText, id } = req.body;
  await Posts.update({
    postText: newPostText,
  }, { where: { id: id } });
  res.json(newPostText);
});

router.put("/cover", validateToken, async (req, res) => {
  const { newCover, id } = req.body;
  await Posts.update({
    cover: newCover,
  }, { where: { id: id } });
  res.json(newCover);
});



// router.put("/:postId", validateToken, async (req, res) => {
//   try {
//     const updatePost = await Posts.findById(req.params.postId);

//     await updatePost.updateOne({ $set: req.body }, {
//       where: {
//         id: postId,
//       }
//     });


//   } catch (err) {
//     res.status(500).json(err);
//   }


// });

router.get("/byUserId/:id", async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Signatures],
  });
  res.json(listOfPosts);
});

module.exports = router;