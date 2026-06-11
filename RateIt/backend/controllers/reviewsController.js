const db = require("../db");
const { analyzeReview } = require("../services/aiService");
const axios = require("axios");

const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) return [];

  return tags
    .filter(t => typeof t === "string")
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0)
    .slice(0, 4);
};

const normalizeProductName = (name) =>
  (name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

// GET all reviews by productId
exports.getReviews = (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return db.all(
      "SELECT * FROM reviews",
      [],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const parsed = rows.map(r => ({
          ...r,
          pros: JSON.parse(r.pros || "[]"),
          cons: JSON.parse(r.cons || "[]")
        }));

        res.json(parsed);
      }
    );
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

const getProductId = (productName, productId) => {
  return new Promise((resolve, reject) => {

    if (productId) return resolve(productId);

    db.get(
      `SELECT id FROM products WHERE name = ?`,
      [productName],
      (err, row) => {
        if (err) return reject(err);

        if (row) {
          resolve(row.id);
        } else {
          db.run(
            `INSERT INTO products (name, rating, trend) VALUES (?, 0, 'up')`,
            [productName],
            function (err) {
              if (err) return reject(err);
              resolve(this.lastID);
            }
          );
        }
      }
    );
  });
};

// CREATE review
exports.createReview = async (req, res) => {
  let {
    productId,
    productName,
    user,
    text,
    rating,
    title,
    link
  } = req.body;

  const normalizedName = normalizeProductName(productName);
  rating = Number(rating);

  if (
    rating != null &&
    (
      typeof rating !== "number" ||
      Number.isNaN(rating) ||
      rating < 1 ||
      rating > 5
    )
  ) {
    return res.status(400).json({
      error: "Rating must be between 1 and 5"
    });
  }

  productId = await getProductId(productName, productId);

  const date = new Date().toISOString();

  try {
    const ai = await analyzeReview(text, rating);

    const safeAI = {
      sentiment: ["positive", "negative", "neutral"].includes(ai.sentiment)
        ? ai.sentiment
        : "neutral",

      summary:
        typeof ai.summary === "string" && ai.summary.trim().length > 0
          ? ai.summary.trim()
          : "No AI summary available",

      pros: Array.isArray(ai.pros) ? ai.pros : [],
      cons: Array.isArray(ai.cons) ? ai.cons : []
    };

    console.log("AI RESULT:", ai);

    // =========================
    // 1. RESOLVE PRODUCT
    // =========================
    const finalProductId = await new Promise((resolve, reject) => {
      if (productId) {
        return resolve(productId);
      }

      if (!productName) {
        return reject(new Error("productName is required"));
      }

      db.get(
        "SELECT id FROM products WHERE name = ?",
        [productName],
        (err, product) => {
          if (err) return reject(err);

          if (product) {
            return resolve(product.id);
          }

          db.run(
            "INSERT INTO products (name, rating, trend) VALUES (?, ?, ?)",
            [productName, rating || 0, "up"],
            function (err) {
              if (err) return reject(err);
              resolve(this.lastID);
            }
          );
        }
      );
    });

    if (!productId && normalizedName) {
      const existing = await new Promise((resolve, reject) => {
        db.get(
          "SELECT id FROM products WHERE LOWER(name) = ?",
          [normalizedName],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (existing) {
        productId = existing.id;
      } else {
        const newId = await new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO products (name, rating, trend) VALUES (?, 0, 'up')",
            [productName.trim()],
            function (err) {
              if (err) reject(err);
              else resolve(this.lastID);
            }
          );
        });

        productId = newId;
      }
    }

    // =========================
    // 2. INSERT REVIEW
    // =========================
    db.run(
      `
      INSERT INTO reviews (
        productId,
        productName,
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
        commentsCount,
        source
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?)
      `,
      [
        finalProductId,
        productName,
        user,
        date,
        rating,
        safeAI.sentiment,
        title,
        link,
        text,
        safeAI.summary,
        JSON.stringify(safeAI.pros),
        JSON.stringify(safeAI.cons),
        null
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // =========================
        // 3. UPDATE PRODUCT RATING
        // =========================
        db.get(
          `
          SELECT AVG(rating) as avgRating
          FROM reviews
          WHERE productId = ?
          AND rating IS NOT NULL
          `,
          [finalProductId],
          (err, row) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            const avg = Number(row.avgRating || 0).toFixed(1);

            db.run(
              `
              UPDATE products
              SET rating = ?
              WHERE id = ?
              `,
              [avg, finalProductId],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }

                res.status(201).json({
                  id: this.lastID,
                  productId: finalProductId
                });
              }
            );
          }
        );
      }
    );
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
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

// IMPORT REDDIT REVIEWS
exports.importRedditReviews = async (req, res) => {
  try {

    const { productId, query } = req.body;

    const redditRes = await axios.get(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5`,
      {
        headers: {
          "User-Agent": "RateItBot/1.0"
        }
      }
    );

    const posts = redditRes.data.data.children;

    for (const p of posts) {

      const post = p.data;

      const rawText =
        post.selftext?.trim() ||
        post.title?.trim();

      const text = rawText
        .replace(/\*\*/g, "")
        .replace(/__/g, "")
        .replace(/`/g, "")
        .replace(/\n+/g, " ")
        .trim();

      if (!text || text.length < 20) continue;

      const ai = await analyzeReview(text, null);

      await new Promise((resolve, reject) => {

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
            commentsCount,
            source
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            productId,
            post.author || "reddit_user",
            new Date(post.created_utc * 1000).toISOString(),
            null,
            ai.sentiment,
            post.title || "Reddit Review",
            `https://reddit.com${post.permalink}`,
            text,
            ai.summary,
            JSON.stringify(normalizeTags(ai.pros)),
            JSON.stringify(normalizeTags(ai.cons)),
            post.ups || 0,
            null,
            0,
            'web-scraped'
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );

      });

    }

    res.json({
      success: true
    });

  } catch (err) {

    console.log("REDDIT IMPORT ERROR:", err.message);

    res.status(500).json({
      error: err.message
    });

  }
};