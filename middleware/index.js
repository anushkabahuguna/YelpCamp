// ALL THE MIDDLEWARE GOES HERE
var Mycamp = require("../models/campgrounds");
var Comment = require("../models/comment");
var middlewareObj = {};
// defining two function variables inside our object

	
// AUTHORIZATION MIDDLEWARE :EDIT DELETE UPDATE
middlewareObj.checkCampgroundOwnership = function (req, res, next){
// 	check if user is logged in
	if(req.isAuthenticated()){
	Mycamp.findById(req.params.id, function (err, foundCampground){
		if(err || !foundCampground )
			{
				req.flash("error", "Campground not found")
				res.redirect("back");
			}
		else{
// 			check if the campground author id matches the current logged in user's id
				// 		the user._id and the campground.athor.id are string and a mongoose object respectively
			if(req.user._id.equals(foundCampground.author.id))
				{
					next();
				}
	
			else{
				req.flash("error", "You don't have the permission to do that")
				res.redirect("back");
			}
		}
		
	});
				
	}
	else{
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
}
	



// AUTHORIZATION MIDDLEWARE :EDIT DELETE UPDATE
middlewareObj.checkCommentOwnership = function (req, res, next){
// 	check if user is logged in
	if(req.isAuthenticated()){
	Comment.findById(req.params.commentid, function (err, foundComment){
		if(err || !foundComment)
			{	req.flash("error", "Comment not found")
				res.redirect("back");
			}
		else{
// 			check if the campground author id matches the current logged in user's id
				// 		the user._id and the campground.athor.id are string and a mongoose object respectively
			if(req.user._id.equals(foundComment.author.id))
				{
					next();
				}
	
			else{
				req.flash("error", "You don't have permission to do that")
				res.redirect("back");
			}
		}
		
	});
				
	}
	else{
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
}

// MIDDLEWARE

middlewareObj.isLoggedIn =function (req, res, next){
	if(req.isAuthenticated())
		{
			return next();
		}
	
	req.flash("error", "You need to be logged in to do that")
	res.redirect("/login");
}


module.exports = middlewareObj;