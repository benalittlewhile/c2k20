// everyone gets a 🍪

// dependencies
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// connect to mongodb
mongoose.set("useNewUrlParser", true);
mongoose.connect("mongodb://localhost/test");

const app = express();
const port = 3000;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
  console.log("mongoose connected to mongodb");

  // we need to put the rest of the app in the callback in order to ensure the
  // db is connected
  app.listen(port, () => console.log(`express listening on localhost:${port}`));
});

app.use(cookieParser());

app.get("/", (req, res) => {
  if (Object.keys(req.cookies).length != 1) {
    console.log(Object.values(req.cookies));
    res.cookie("c2k20", 1, { maxAge: 900000, httpOnly: true });
    res.send("here's your 🍪!");
    console.log("served a fresh 🍪");
  } else {
    res.send("You already have a 🍪!");
  }
});
