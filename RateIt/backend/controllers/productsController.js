const db = require("../db");

// GET ALL PRODUCTS
const getProducts = (req, res) => {

  db.all(
    "SELECT * FROM products",
    [],
    (err, rows) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      const formatted = rows.map(p => ({
        ...p,
        pros: [],
        cons: []
      }));

      res.json(formatted);
    }
  );
};

// GET PRODUCT BY ID
const getProductById = (req, res) => {

  const id = Number(req.params.id);

  db.get(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (err, row) => {

      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      if (!row) {
        return res.status(404).json({
          message: "Product not found"
        });
      }

      res.json({
        ...row,
        pros: [],
        cons: []
      });
    }
  );
};

module.exports = {
  getProducts,
  getProductById
};