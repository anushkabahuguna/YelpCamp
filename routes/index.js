var express = require("express");
var router = express.Router();
var passport = require("passport");
var User	= require("../models/user");

// ROOT ROUTE
router.get("/", function(req, res){
	res.render("landing");
});


// ====================================
// AUTH ROUTES
// ====================================
// SHOW REGISTER FORM
router.get("/register", function(req, res){
	res.render("register");
});

// THIS ROUTE WILL HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
	
	var newUser = new User({username : req.body.username});
	User.register(newUser, req.body.password, function(err, user){
			if(err)
				{
					req.flash("error", err.message);
					return res.redirect("register");
				}
	
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp "  + user.username)
			res.redirect("/campgrounds");
		});
		
	});
});

// SHOW LOGIN FORM

router.get("/login", function(req, res){
	
	res.render("login");
});
// HANDLING LOGIN LOGIC
// http://www.passportjs.org/docs/authenticate/
// we used the custom allback method to login as we wanted to have access to user and err object for our flash messages
// NOTE IN THIS WAY YOU HAVE TO USE REQ.LOGIN() FOR ESTABLISHING A SESSION
router.post("/login", function(req, res, next) {
    passport.authenticate("local", function(err, user, info) {
        if (err) { 
// 			if an exception occurs
            req.flash("error", err.message);
            return res.redirect("/login"); 
        }
        // User is set to false if auth fails.
        if (!user) { 
            req.flash("error", info.message); 
            return res.redirect("/login"); 
        }
        // Establish a session manually with req.logIn
        req.logIn(user, function(err) {
            if (err) { 
                req.flash("error", err.message);
                res.redirect("/login");
            }
            
            // Login success! Add custom success flash message.
            req.flash("success", "Welcome back " + user.username + "!");
            res.redirect("/campgrounds");
          
        });
    })(req, res, next);
});
// router.post("/login", passport.authenticate("local",{
// 	successRedirect : "/campgrounds",
// 	failureRedirect : "/login",
// 	failureFlash: true,
// 	successFlash: "Welcome! " + currentUser.username 
	
// });

// LOGOUT ROUTE
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully Logged Out");
	res.redirect("/campgrounds");
});

module.exports =router;