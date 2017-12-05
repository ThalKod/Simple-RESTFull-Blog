var middleware = {};

middleware.isLogedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}


module.exports = middleware;