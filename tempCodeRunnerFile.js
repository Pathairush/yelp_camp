var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    var campgrounds = [
        {
            name: "Salmon Creek",
            image:
                "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=959&q=80",
        },
        {
            name: "Granit Hill",
            image:
                "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        },
        {
            name: 'Mountain goat"s rest',
            image:
                "https://images.unsplash.com/photo-1520095972714-909e91b038e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        },
    ];
    res.render("campgrounds", { campgrounds: campgrounds });
});

// to make the route following the convention called REST
app.post("/campgrounds", function (req, res) {
    res.send("YOU HIT THE POST ROUTE");
    // get data from form and add to campgrounds array

    // redirect back to campgrounds page
});

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.listen(3000, function () {
    console.log("yelpcamp has started.");
});
