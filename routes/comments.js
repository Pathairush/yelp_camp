var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); // it will call the index.js in the path automatically.

// NEW comment route
router.get("/new", middleware.isLoggedIn, (req, res) => {
    var id = req.params.id;
    Campground.findById(id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

// CREATE comment route
router.post("/", middleware.isLoggedIn, (req, res) => {
    // lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // crate new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "something went wrong");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // connet new comment to campground
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    // redirect
                    req.flash("success", "Successfully added comment");
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

// EDIT Comment
router.get(
    "/:comment_id/edit",
    middleware.checkCommentOwnership,
    (req, res) => {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", {
                    campground_id: req.params.id,
                    comment: foundComment,
                });
            }
        });
    }
);

// Update Comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(
        req.params.comment_id,
        req.body.comment,
        (err, updatedComment) => {
            if (err) {
                res.redirect("back");
            } else {
                res.redirect(`/campgrounds/${req.params.id}`);
            }
        }
    );
});

// DELETE comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    // find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!");
            res.redirect(`/campgrounds/${req.params.id}/`);
        }
    });
});

module.exports = router;
