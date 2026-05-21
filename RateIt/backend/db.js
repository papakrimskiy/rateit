const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      rating REAL,
      trend TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER,
      user TEXT,
      date TEXT,
      rating REAL,
      sentiment TEXT,
      title TEXT,
      link TEXT,
      text TEXT,
      summary TEXT,
      pros TEXT,
      cons TEXT,
      upvotes INTEGER,
      downvotes INTEGER,
      commentsCount INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reviewId INTEGER,
      user TEXT,
      date TEXT,
      text TEXT,
      up INTEGER,
      down INTEGER,
      replies INTEGER
    )
  `);

  // PRODUCTS SEED
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      db.run(`
        INSERT INTO products (name, rating, trend)
        VALUES
        ('CMF Phone 2 Pro by Nothing', 4.4, 'up'),
        ('Піцерія Pizza Day', 4.6, 'down')
      `);
    }
  });

  // REVIEWS SEED
  db.get("SELECT COUNT(*) as count FROM reviews", (err, row) => {
    if (row.count === 0) {
      db.run(`
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
        VALUES
        (
          1,
          'Ivan',
          datetime('now'),
          4.5,
          'positive',
          'Хороший телефон',
          '',
          'Гарний телефон...',
          '',
          '[]',
          '[]',
          3,
          1,
          2
        ),
        (
          2,
          'Anna',
          datetime('now'),
          4.7,
          'positive',
          'Смачна піца',
          '',
          'Дуже смачно',
          5,
          0,
          1
        )
      `);
    }
  });

  // COMMENTS SEED
  db.get("SELECT COUNT(*) as count FROM comments", (err, row) => {
    if (row.count === 0) {
      db.run(`
        INSERT INTO comments (
          reviewId,
          user,
          date,
          text,
          up,
          down,
          replies
        )
        VALUES
        (
          1,
          'Anna',
          datetime('now'),
          'Погоджуюсь',
          3,
          0,
          1
        ),
        (
          1,
          'Oleh',
          datetime('now'),
          'Не згоден',
          1,
          2,
          0
        )
      `);
    }
  });

});

module.exports = db;