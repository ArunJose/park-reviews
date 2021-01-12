const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Park = require("./models/park");

mongoose.connect("mongodb://localhost:27017/park-reviews", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.log.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/parks", async (req, res) => {
  const parks = await Park.find({});
  res.render("parks/index", { parks });
});

app.post("/parks", async (req, res) => {
  const park = new Park(req.body.park);
  await park.save();
  res.redirect(`/parks/${park._id}`);
});

app.get("/parks/new", (req, res) => {
  res.render("parks/new");
});

app.get("/parks/:id", async (req, res) => {
  const park = await Park.findOne({ _id: req.params.id });
  res.render("parks/show", { park });
});

app.listen(3000, () => {
  console.log("Serving at port 3000");
});
