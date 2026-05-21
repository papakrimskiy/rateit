const db = require("../db");
const { analyzeReview } = require("../services/aiService");

// GET all reviews by productId
exports.getReviews = (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.json([]);
  }

  db.all(
    "SELECT * FROM reviews WHERE productId = ?",
    [productId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const parsed = rows.map(r => ({
        ...r,
        pros: JSON.parse(r.pros || "[]"),
        cons: JSON.parse(r.cons || "[]")
      }));

      res.json(parsed);
    }
  );
};

// GET review by id
exports.getReviewById = (req, res) => {
  db.get(
    "SELECT * FROM reviews WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res.status(404).json({ message: "Review not found" });
      }

      row.pros = JSON.parse(row.pros || "[]");
      row.cons = JSON.parse(row.cons || "[]");

      res.json(row);
    }
  );
};

// CREATE review
exports.createReview = async (req, res) => {
  const {
    productId,
    user,
    text,
    rating,
    title,
    link
  } = req.body;

  const ai = await analyzeReview(text, rating);
  console.log("AI RESULT:", ai);

  const date = new Date().toISOString();

  db.run(
    `
    INSERT INTO reviews (
      productId,
      user,
      date,
      rating,
      sentiment,
      title,
      link,
      text,
      summary,
      pros,
      cons,
      upvotes,
      downvotes,
      commentsCount
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0)
    `,
    [
      productId,
      user,
      date,
      rating,
      ai.sentiment,
      title,
      link,
      text,
      ai.summary,
      JSON.stringify(ai.pros),
      JSON.stringify(ai.cons)
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({ id: this.lastID });
    }
  );
};

// LIKE review
exports.likeReview = (req, res) => {
  db.run(
    `
    UPDATE reviews
    SET upvotes = upvotes + 1
    WHERE id = ?
    `,
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.get(
        "SELECT * FROM reviews WHERE id = ?",
        [req.params.id],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          row.pros = JSON.parse(row.pros || "[]");
          row.cons = JSON.parse(row.cons || "[]");

          res.json(row);
        }
      );
    }
  );
};

// DISLIKE review
exports.dislikeReview = (req, res) => {
  db.run(
    `
    UPDATE reviews
    SET downvotes = downvotes + 1
    WHERE id = ?
    `,
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.get(
        "SELECT * FROM reviews WHERE id = ?",
        [req.params.id],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          row.pros = JSON.parse(row.pros || "[]");
          row.cons = JSON.parse(row.cons || "[]");

          res.json(row);
        }
      );
    }
  );
};