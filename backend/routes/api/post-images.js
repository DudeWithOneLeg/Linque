const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { User, Friend, Post, Comment, PostImage } = require("../../db/models");

const router = express.Router();

router.delete("/:imageId", [requireAuth], async (req, res) => {
  const { imageId } = req.params;
  const image = await PostImage.findByPk(imageId);
  const post = await Post.findByPk(image.postId);

  if (image) {
    await image.destroy();
  }

  if (post) {
    await post.update({
      hasImage: false,
    });
  }

  res.status(200);
  return res.json({
    message: "Image successfully deleted.",
  });
});

module.exports = router;
