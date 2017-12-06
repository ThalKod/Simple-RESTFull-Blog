
var Blog        = require("../models/blog");
var Comment     = require("../models/comment");        

var middleware = {};

middleware.isLogedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("error", "You must be logged");
        res.redirect("/login");
    }
};

middleware.checkBlogOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, rBlog){
            if(err){
                res.redirect("back");
            }else{
                if(rBlog.userId.equals(req.user._id)){
                    next();
                }else{
                    req.flash("nopermission","You don't have permisson");
                    res.redirect("back");
                }
            }
       });
    }else{
        req.flash("error", "You must be logged");
        res.redirect("back");
    }
};

middleware.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){

        Blog.findById(req.params.id, function(err, rBlog){
            if(err){
                res.redirect("back");
            }else{
                Comment.findById(req.params.commentId, function(err, rComment){
                    if(err){
                        console.log(err);
                        res.redirect("back");
                    }else{
                        if(rComment.author.id.equals(req.user._id)){
                            next();
                        }else{
                            req.flash("nopermission","You don't have permisson");
                            res.redirect("back");
                        }
                    }
                });
            }
       });
    }else{
        req.flash("error", "You must be logged");
        res.redirect("back");
    }
}

module.exports = middleware;