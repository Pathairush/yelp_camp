var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROUTE
router.get("/", function (req, res) {
    res.render("landing");
});

// ===============================
// AUTH ROUTES
// ===============================

// shows register form
router.get("/register", (req, res) => {
    res.render("campgrounds/register");
});
// handler signup logic
router.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    var password = req.body.password;
    User.register(newUser, password, (err, user) => {
        if (err) {
            return res.render("campgrounds/register", {"error": err.message});
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", `Welcome to YelpCamp ${user.username}`);
                res.redirect("/campgrounds");
            });
        }
    });
});

// LOG IN
router.get("/login", (req, res) => {
    res.render("campgrounds/login");
});

router.post(
    "/login",
    // middleware
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "campgrounds/login",
    }),
    (req, res) => {}
);

// LOG OUT
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;
