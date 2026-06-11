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
  const { reviewId, user, text, parentId } = req.body;

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
      replies,
      parentId
    )
    VALUES (?, ?, ?, ?, 0, 0, 0, ?)
    `,
    [reviewId, user, date, text, parentId || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      db.run(
        `
        UPDATE reviews
        SET commentsCount = commentsCount + 1
        WHERE id = ?
        `,
        [reviewId],
        (err) => {

          if (err) {
            return res.status(500).json({
              error: err.message
            });
          }

          res.status(201).json({
            id: this.lastID
          });
          
        });
    }
  );
};

exports.likeComment = (req, res) => {
  const { id } = req.params;

  db.run(
    "UPDATE comments SET up = up + 1 WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
};

exports.dislikeComment = (req, res) => {
  const { id } = req.params;

  db.run(
    "UPDATE comments SET down = down + 1 WHERE id = ?",
    [id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    }
  );
};