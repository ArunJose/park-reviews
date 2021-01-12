const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Park = require("./models/park");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));

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

app.get("/parks/:id/edit", async (req, res) => {
  const park = await Park.findOne({ _id: req.params.id });
  res.render("parks/edit", { park });
});

app.put("/parks/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
  res.redirect(`/parks/${park._id}`);
});

app.delete("/parks/:id", async (req, res) => {
  const { id } = req.params;
  await Park.findByIdAndDelete(id);
  res.redirect(`/parks`);
});

app.listen(3000, () => {
  console.log("Serving at port 3000");
});
