var express     = require("express"),
    User        = require("../models/user"),
    passport    = require("passport");

var router      = express.Router();

router.get("/", function(req, res){
    res.redirect("/blogs");
});

//Rigister Routes
router.get("/register", function(req,res){
    res.render("register");
}); 

router.post("/register", function(req, res){
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
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "login"
}), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;