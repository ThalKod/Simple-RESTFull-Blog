var  express             = require("express"),
     Blog                = require("../models/blog");

var router              = express.Router();



//Index ROUTE
router.get("/blogs", function(req, res){
    Blog.find({}, function(err, rBlogs){
        if(err){
            console.log("Error retrieving Database Filed");   
        }else{
            res.render("index", {blogs: rBlogs});
        }
    }); 
});

//New ROUTE
router.get("/blogs/new", function(req, res){
    res.render("new");
});

// Create ROUTE
router.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);    

    Blog.create(req.body.blog, function(err, rblogs){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTES 
router.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id).populate("comment").exec(function(err, rBlog){
        if(err){
            res.redirect("index");
        }else{
            res.render("show", {blog: rBlog});
        }
    });
});

//EDIT ROUTE
router.get("/blogs/:id/edit", function(req,res){
   Blog.findById(req.params.id, function(err, rBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: rBlog});
        }
   });
});

//UPDATE ROUTES
router.put("/blogs/:id", function(req, res){

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
router.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});


module.exports = router;