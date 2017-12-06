var  express             = require("express"),
     Blog                = require("../models/blog"),
     middleware          = require("../middleware/index");
     

var router              = express.Router();



//Index ROUTE
router.get("/", function(req, res){
    Blog.find({}, function(err, rBlogs){
        if(err){
            console.log("Error retrieving Database Filed");   
        }else{
            res.render("index", {blogs: rBlogs});
        }
    }); 
});

//New ROUTE
router.get("/new", middleware.isLogedIn, function(req, res){
    res.render("new");
});

// Create ROUTE
router.post("/", middleware.isLogedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);    

    Blog.create(req.body.blog, function(err, rblogs){
        if(err){
            res.render("new");
        }else{
            rblogs.userId = req.user._id;
            rblogs.save();

            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTES 
router.get("/:id", function(req, res){
    Blog.findById(req.params.id).populate("comment").exec(function(err, rBlog){
        if(err){
            res.redirect("/");
        }else{
            res.render("show", {blog: rBlog});
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkBlogOwnership, function(req,res){
   Blog.findById(req.params.id, function(err, rBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: rBlog});
        }
   });
});

//UPDATE ROUTES
router.put("/:id", middleware.checkBlogOwnership, function(req, res){

    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, rBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    })
});

//Destroy ROUTE
router.delete("/:id", middleware.checkBlogOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/blogs");
        }
    });
});


module.exports = router;