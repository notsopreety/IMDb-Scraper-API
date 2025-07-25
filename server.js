const express = require("express");
const cors = require("cors");
const path = require("path");

const searchRoutes = require("./routes/search");
const genresRoutes = require("./routes/genres");
const movieDetailsRoutes = require("./routes/movieDetails");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.set("json spaces", 2);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/search", searchRoutes);
app.use("/genres", genresRoutes);
app.use("/getmoviedetails", movieDetailsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
