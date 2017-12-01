//#################################################################################
//############################# GENERAL SETUP  ####################################
//#################################################################################

var express          = require("express"),
    methodOverride   = require("method-override"),
    mongoose         = require("mongoose"),
    bodyParser       = require("body-parser"),
    app              = express(),
    expressSanitizer = require("express-sanitizer"),
    Blog             = require("./models/blog"),
    User             = require("./models/user"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    expressSession   = require("express-session");   
    
   

app.set("view engine", "ejs");
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


var DBUrl = process.env.DATABASEURL || "mongodb://localhost/blogdb";

mongoose.connect(DBUrl, {useMongoClient: true});
mongoose.Promise = global.Promise;


//Passport Configuration
app.use((expressSession)({
    secret: "a4f8542071f-c33873-443447-8ee2321",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Setting a General Middleware
app.use(function(req, res, next){
     res.locals.currentUser = req.user;
     next();    
 });

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

//////////////////////////////////////////////////////////////////////////////

//Rigister Routes
app.get("/register", function(req,res){
    res.render("register");
}); 

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }else{
            console.log(user);
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });
});

//Login Routes
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "login"
}), function(req, res){
});

app.get("/logout", function(req, req){
    req.logout();
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
    console.log("Server is Active... ");
}); 