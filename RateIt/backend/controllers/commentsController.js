const db = require("../db");

// GET comments by reviewId
exports.getComments = (req, res) => {
  const { reviewId } = req.query;

  if (!reviewId) {
    return res.json([]);
  }

  db.all(
    "SELECT * FROM comments WHERE reviewId = ?",
    [reviewId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(rows);
    }
  );
};

// CREATE comment
exports.createComment = (req, res) => {
  const { reviewId, user, text } = req.body;

  const date = new Date().toISOString();

  db.run(
    `
    INSERT INTO comments (
      reviewId,
      user,
      date,
      text,
      up,
      down,
      replies
    )
    VALUES (?, ?, ?, ?, 0, 0, 0)
    `,
    [reviewId, user, date, text],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID
      });
    }
  );
};