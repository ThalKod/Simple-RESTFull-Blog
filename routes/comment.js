var express     = require("express"),
    Blog        = require("../models/blog"),
    Comment     = require("../models/comment");

var router      = express.Router({mergeParams: true});


//Create Comment routes
router.post("/", function(req, res){
    Blog.findById(req.params.id, function(err, rBlog){
        console.log(req.params.id);
        if(err || rBlog === null){
            console.log(err);
            res.redirect("/");
        }else{
            Comment.create(req.body.comment, function(err, rComment){
                if(err){
                    console.log(err);
                    res.redirect("/");
                }else{
                    rComment.author.id  = req.user._id;
                    rComment.author.username = req.user.username;
                    rComment.save();

                    console.log(rBlog);
                    rBlog.comment.push(rComment);
                    rBlog.save();

                    res.redirect("/blogs/" + req.params.id);
                }
            });
        }   
    });
});

//Delete Comment Routes
router.delete("/:commentId", function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            console.log("deleted");
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


module.exports = router;