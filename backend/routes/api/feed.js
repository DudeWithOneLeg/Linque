const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { User, Friend, Post, Comment, PostImage } = require("../../db/models");
const { Op } = require("sequelize");

//Flatten or 'normalize' an object
const flatten = (arr) => {
  const obj = {};
  for (let el of arr) {
    if (el.results) {
      // console.log(el.results);
      el.data = JSON.parse(el.results);
    }
    obj[el.id] = el;
  }
  return obj;
};

const router = express.Router();

//Get all posts only if friends
router.get("/", requireAuth, async (req, res) => {
  const userid = req.user.id;

  const friends = await Friend.findAll({
    where: {
      [Op.or]: [{ toUserId: userid }, { fromUserId: userid }],
      status: "friends",
    },
  });

  const friendsIds = [userid];

  friends.map((friend) => {
    if (
      friend.toUserId !== userid &&
      friend.fromUserId == userid &&
      !friendsIds.includes(friend.toUserId) &&
      friend.status === "friends"
    )
      return friendsIds.push(friend.toUserId);
    else if (
      friend.fromUserId !== userid &&
      friend.toUserId === userid &&
      !friendsIds.includes(friend.fromUserId) &&
      friend.status === "friends"
    ) {
      return friendsIds.push(friend.fromUserId);
    }
  });

  let posts = await Post.findAll({
    where: {
      userId: {
        [Op.in]: friendsIds,
      },
    },
    include: [
      {
        model: Comment,
        include: User,
      },
      User,

      {
        model: PostImage,
      },
    ],
  });

  const newPosts = [];

  posts.forEach((post) => {
    post = post.toJSON();
    // console.log(post.User);
    if (post.PostImage) {
      (post.url = post.PostImage.url),
        (post.data = JSON.parse(post.PostImage.data));
    }
    if (post.Comments) {
      post.Comments = flatten(post.Comments);
    }
    newPosts.push(post);
  });

  res.status(200);
  return res.json(newPosts);
});

module.exports = router;
