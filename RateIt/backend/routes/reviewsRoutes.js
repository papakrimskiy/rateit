const express = require("express");
const router = express.Router();

const {
  getReviews,
  getReviewById,
  createReview,
  likeReview,
  dislikeReview
} = require("../controllers/reviewsController");

router.get("/", getReviews);
router.get("/:id", getReviewById);
router.post("/", createReview);
router.post("/:id/like", likeReview);
router.post("/:id/dislike", dislikeReview);

module.exports = router;