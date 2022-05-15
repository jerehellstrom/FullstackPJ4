var express = require("express");
var app = express();
var bodyParser = require("body-parser");
// !! important !! creates /x-www-form-urlencoded parser - Remember to select body and x-www-form-urlencoded in postman
app.use(bodyParser.urlencoded({ extended: true }));

// uri = link to mongoose cluster - if doesn't let connect make sure ip is allowed and you have correct username:password
var mongoose = require("mongoose");
var uri =
  "mongodb+srv://dbuser:demopass@cluster0.qt87c.mongodb.net/sample_mflix";

// Connect to mongo.db with mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Schema
const Movie = mongoose.model(
  "Movie",
  {
    title: String,
    year: Number,
    poster: String,
  },
  "movies"
);

// Get all movies
app.get("/api/getall", function (req, res) {
  // Documentation: https://mongoosejs.com/docs/api.html#model_Model.find
  Movie.find({}, null, { limit: 10 }, function (err, results) {
    console.log(results);
    res.json(results, 200);
  });
});

// Get movie with specific ID
app.get("/api/:id", function (req, res) {

  var id = req.params.id;
  Movie.findById(id, function (err, results) {

    if (err) {
      console.log(err);
      res.json("System Error.", 500);
    } else if (results == null) {
      res.json("Could not find item with given ID", 200);
    } else {
      console.log(results);
      res.json(results, 200);

    }
  });
});

// Add 1 Movie
app.post("/api/add", function (req, res) {
  var nimi = req.body.title;
  var vuosi = req.body.year;

  const film = new Movie({
    title: nimi,
    year: vuosi,
  })
  console.log(film);
  film.save();

  console.log(req.body);
  res.send("Added Movie: " + req.body.title + " (" + req.body.year + ")");
});

// Edit a movie with its ID
app.put("/api/update/:id", function (req, res) {

  var id = req.params.id;

  Movie.findByIdAndUpdate(id, { title: "New Name" }, function (err, results) {

    if (err) {
      res.json("System Error.", 500);
    }
    else {
      res.json("Updated movie with id: " + req.params.id + " named: " + results.title);
    }
  });
});

// Delete movie with its ID
app.delete("/api/delete/:id", function (req, res) {

  var id = req.params.id;

  Movie.findByIdAndDelete(id, function (err, results) {
    if (err) {
      console.log(err);
      res.json("System Error.", 500);
    } else if (results == null) {
      res.json("Could not find file for deletion.", 200);
    } else {
      console.log(results);
      res.json("Deleted " + id + " " + results.title, 200);
    }
  });
});

app.listen(8081, function () {
  console.log("Listening to port 8081!");
});