//#################################################################################
//############################# GENERAL SETUP  ####################################
//#################################################################################

var express          = require("express"),
    methodOverride   = require("method-override"),
    mongoose         = require("mongoose"),
    bodyParser       = require("body-parser"),
    app              = express(),
    expressSanitizer = require("express-sanitizer");
   



app.set("view engine", "ejs");
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


mongoose.connect("mongodb://testBlogapp:password@ds123956.mlab.com:23956/blogapp", {useMongoClient: true});
//mongoose.connect("mongodb://localhost/blogdb", {useMongoClient: true});


mongoose.Promise = global.Promise;

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// Creating a DB entries For Test
// Blog.create({
//     title: "Test",
//     image: "http://www.pngall.com/wp-content/uploads/2016/07/Car-Free-PNG-Image.png",
//     body: "Lorem ipsum dolor sit amet, eos cu decore audire assentior. Has in quod fugit putant. Eam singulis adipisci in, ei putent expetendis nec, vix labores fuisset id. Sed te summo falli intellegebat, usu meis graeci te. At ferri lorem sea. Cu vim errem munere legere. Percipit mnesarchum sit cu, cu partem nemore verear nec, dicta bonorum vivendo ius te."
// }, function(err, rBlogs){
//     if(err){
//         console.log("Error not Created");
//     }else{
//         console.log(rBlogs);
//     }
// });

//#################################################################################
//################################ ROUTES  ########################################
//#################################################################################

app.get("/", function(req, res){
    res.redirect("/blogs");
});

//Index ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, rBlogs){
        if(err){
            console.log("Error retrieving Database Filed");   
        }else{
            res.render("index", {blogs: rBlogs});
        }
    }); 
});

//New ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// Create ROUTE
app.post("/blogs", function(req, res){
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
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, rBlog){
        if(err){
            res.redirect("index");
        }else{
            res.render("show", {blog: rBlog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
   Blog.findById(req.params.id, function(err, rBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: rBlog});
        }
   });
});

//UPDATE ROUTES
app.put("/blogs/:id", function(req, res){

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
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.port || 3000, function(){
    console.log("Server is Active... ");
}); 