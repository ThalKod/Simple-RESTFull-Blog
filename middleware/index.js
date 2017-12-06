var Blog        = require("../models/blog");


var middleware = {};

middleware.isLogedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

middleware.checkBlogOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, rBlog){
            if(err){
                res.redirect("back");
            }else{
                if(rBlog.userId.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
       });
    }else{
        res.redirect("back");
    }
    
}

module.exports = middleware;