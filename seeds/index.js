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
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        price: Math.floor(Math.random() * 7) * 50,
        image: `https://source.unsplash.com/collection/208422`,
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
