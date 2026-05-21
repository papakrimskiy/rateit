const express = require("express");
const router = express.Router();

const {
  getComments,
  createComment
} = require("../controllers/commentsController");

router.get("/", getComments);
router.post("/", createComment);

module.exports = router;