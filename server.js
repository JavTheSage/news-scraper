const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
var mongoose = require("mongoose");

var db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.send("Hello world");
});


app.get("/all", function (req, res) {

    db.Layout.find({}).then(dbLayout => {
        res.json(dbLayout);
    });
});


app.get("/scrape", function (req, res) {

    axios.get("https://www.freecodecamp.org/news/").then(function (response) {

        const $ = cheerio.load(response.data);

        $("article").each(function (i, element) {

            const results = {};

            results.image = "https://www.freecodecamp.org" + $(this).children().find(".post-card-image").attr("src");
            results.date = $(this).children().find("time").text();
            results.title = $(this).children().find(".post-card-title a").text().trim();
            results.enterDomain = "https://www.freecodecamp.org" + $(this).children().find(".post-card-title a").attr("href");

            // console.log(`Date: ${results.date} \nTitle: ${results.title} \nHref: ${results.enterDomain} \nImage: ${results.image}`)

            if (results.title) {
                db.Layout.create({
                    title: results.title,
                    date: results.date,
                    image: results.image,
                    enterDomain: results.enterDomain
                })
                .then(function(inserted){
                    console.log(inserted)
                    res.render(inserted)
                })
                .catch(function(err){
                    if (err){
                        console.log(err)
                    }
                })



            }
        });
    });

    res.send("Scrape Complete");
});



app.listen(3000, function () {
    console.log("App running on port 3000!");
});

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
