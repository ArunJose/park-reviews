const path = require("path");
const mongoose = require("mongoose");
const Park = require("../models/park");
const { cities } = require("./cities");
const { descriptors, parkTypes } = require("./seedHelpers");

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

const randomIdx = (arr) => {
  return Math.floor(Math.random() * arr.length);
};

const seedDB = async () => {
  try {
    await Park.deleteMany({});
    for (let i = 0; i < 150; i++) {
      let newPark = new Park({
        title: `${descriptors[randomIdx(descriptors)]} ${
          parkTypes[randomIdx(parkTypes)]
        }`,
        location: `${cities[randomIdx(cities)].city}`,
      });
      await newPark.save();
    }
    const allParks = await Park.find({});
    console.log(allParks);
  } catch (e) {
    console.log(e);
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
