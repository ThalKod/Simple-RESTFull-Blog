var express     = require("express"),
    Blog        = require("../models/blog"),
    Comment     = require("../models/comment");

var router      = express.Router();


//Create Comment routes
router.post("/blogs/:id/comments", function(req, res){
    Blog.findById(req.params.id, function(err, rBlog){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            Comment.create(req.body.comment, function(err, rComment){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    rComment.author.id  = req.user._id;
                    rComment.author.username = req.user.username;
                    rComment.save();

                    rBlog.comment.push(rComment);
                    rBlog.save();

                    res.redirect("/blogs/" + req.params.id);
                }
            });
        }   
    });
});


module.exports = router;