const express = require("express");
const router = express.Router();

const {
  getComments,
  createComment,
  likeComment,
  dislikeComment
} = require("../controllers/commentsController");

router.get("/", getComments);
router.post("/", createComment);
router.post("/:id/like", likeComment);
router.post("/:id/dislike", dislikeComment);

module.exports = router;