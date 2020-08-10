var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/unit18Populater";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


app.get("/scrape", function (req, res) {
    axios.get("https://www.npr.org/sections/news/").then(function (response) {
        console.log(response.data)
        var $ = cheerio.load(response.data);

        $("div.item-info").each(function (i, element) {
            var result = {};
            result.title = $(this)
                .children("h2.title")
                .children("a")
                .text();
            result.link = $(this)
                .children("h2.title")
                .children("a")
                .attr("href");
            console.log(result)

            db.Article.create(result)
                .then(function (dbArticle) {

                    console.log(dbArticle);
                })
                .catch(function (err) {

                    console.log(err);
                });
        });

        res.send("Scrape Complete");
    });
});


app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.log(err);
        });
});


app.get("/articles/:id", function (req, res) {

    db.Article.findOne({ _id: req.params.id })

        .populate("comment")
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});


app.post("/articles/:id", function (req, res) {

    db.Comment.create(req.body)
        .then(function (dbComment) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});