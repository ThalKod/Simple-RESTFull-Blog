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
    Comment          = require("./models/comment"),
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    expressSession   = require("express-session"),
    blogRoute        = require("./routes/blog");   
    
   

app.set("view engine", "ejs");
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


var DBUrl = process.env.DATABASEURL || "mongodb://localhost/blogdb";

mongoose.connect(DBUrl, {useMongoClient: true}, function(err){
    if(err){
        throw err;
    }
});
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

app.use(blogRoute);

app.get("/", function(req, res){
    res.redirect("/blogs");
});

////////////////////////////////////////////////////////////////////////////////////
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

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

///////////////////////////////////////////////////////////////////////////////////////

//Comments Routes
app.post("/blogs/:id/comments", function(req, res){
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

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is Active... ");
}); 