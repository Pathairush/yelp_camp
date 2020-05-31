require("dotenv").config();
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

// requring route
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// this will be the mongo atlas on the cloud
mongoose
    .connect(
        process.env.DB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(() => {
        console.log("Connected to mongo atlas!");
    })
    .catch((err) => {
        console.log("ERROR:", err.message);
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "\\public"));
app.use(methodOverride("_method"));
app.use(flash()); // it need to place before the passport configuration

// PASSPORT CONFIGURE
app.use(
    require("express-session")({
        secret: "Once again Pat wins",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this function will called in every route so we can acess currentUser everywhere.
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
// id won't be send to the route. you need to use the mergeParams option in that specifice route file
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT || 3000, function () {
    console.log("yelpcamp has started.");
});
