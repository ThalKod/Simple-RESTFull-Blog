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
    blogRoute        = require("./routes/blog"),
    commentRoute     = require("./routes/comment"),
    indexRoute       = require("./routes/index"),
    flash            = require("req-flash");      
    
   

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

app.use(flash());

//Setting a General Middleware
app.use(function(req, res, next){
     res.locals.currentUser = req.user; 
     res.locals.error = req.flash("error");
     res.locals.success = req.flash("success");
     res.locals.nopermission  = req.flash("nopermission");
     next();    
 });


app.use("/",indexRoute);
app.use("/blogs",blogRoute);
app.use("/blogs/:id/comments",commentRoute);


app.listen(process.env.PORT || 3000, function(){
    console.log("Server is Active... ");
}); 