// everyone gets a 🍪

// dependencies
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const pug = require("pug");
const path = require("path");

// connect to mongodb
mongoose.set("useNewUrlParser", true);
mongoose.connect("mongodb://localhost/test");

// set up express
const app = express();
const port = 3000;
app.set("view engine", "pug");
app.use(cookieParser());
app.use(express.static("public"));

// have pug compile our views so we can use them later
const renderExistingCookie = pug.compileFile("./views/existingCookie.pug");
const renderNewCookie = pug.compileFile("./views/newCookie.pug");

// set up mongoose
const db = mongoose.connection;
const cookieSchema = new mongoose.Schema({
  number: Number,
});
const cookieColl = mongoose.model("cookies", cookieSchema);

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () {
  console.log("mongoose connected to mongodb");

  // we need to put the rest of the app in the callback in order to ensure the
  // db is connected
  app.listen(port, () => console.log(`express listening on localhost:${port}`));
});

// configure our main route
app.get("/", (req, res) => {
  // if the user didn't send a cookie with the request
  if (Object.keys(req.cookies).length == 0) {
    let newCookie = findNewCookie();
    let newCookieDoc = new cookieColl({ number: newCookie });
    newCookieDoc.save((err) => {
      if (err) console.log(err);
    });
    res.cookie("c2k20", newCookie, { maxAge: 900000, httpOnly: true });
    res.send(
      renderNewCookie({
        cookienumber: newCookie,
      })
    );
    console.log(`served a fresh 🍪, ${newCookie}`);
  } else {
    console.log(Object.values(req.cookies));
    res.send(
      renderExistingCookie({
        cookienumber: req.cookies.c2k20,
      })
    );
  }
});

function findNewCookie() {
  console.log("baking");
  let newCookie = makeRandomCookie();
  if (~cookieColl.exists({ number: newCookie })) {
    return newCookie;
  } else {
    return findNewCookie();
  }
}

function makeRandomCookie() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
