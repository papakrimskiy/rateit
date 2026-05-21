require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./db");

const productsRoutes = require("./routes/productsRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const commentsRoutes = require("./routes/commentsRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/products", productsRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/comments", commentsRoutes);

app.get("/", (req, res) => {
  res.send("Backend works");
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});