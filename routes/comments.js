var express = require("express");
var router = express.Router({mergeParams : true});
var Mycamp  = require("../models/campgrounds");
var Comment  = require("../models/comment");
var middleware = require("../middleware");


// ============================================
// COMMENTS ROUTES
// ============================================

// COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	
	Mycamp.findById(req.params.id, function(err, found){
		if(err || !found)
			{
				 req.flash("error", "Campground not found");
            res.redirect("back");
			}
		else{
			res.render("./comments/new",{ campground : found} );
		}
	});
	

});

// COMMENTS CREATE
router.post("/", middleware.isLoggedIn , function(req, res){
		// lookup id campground, create a comment and associate it with the campground, redirect to show page
		
		Mycamp.findById(req.params.id,function(err ,camp){
			if(err)
				{
					console.log(err);
					res.redirect("/campgrounds");
				}
			else
				{
					Comment.create(req.body.comment, function(err, comment){
						if(err)
							{
								req.flash("error", "Something went wrong");
								console.log(err);
							}
						else{
// 							bEFORE SAVING COMMENT TO USER WE WILL ADD AN ID AND USERNAME TO IT AND THEN
							comment.author.id = req.user._id;
							comment.author.username = req.user.username
// 							save comment then
							comment.save();
// 							SAVE THE MODIFIED COMMENT TO OUR USER
							camp.comments.push(comment);
							camp.save();
							req.flash("success", "Successfully added comment")
							res.redirect("/campgrounds/" + camp._id)
						}
					});
					
					
				}
		});
	
});

// EDIT ROUTE FOR COMMENTS
router.get("/:commentid/edit", middleware.checkCommentOwnership, function(req, res){
	
	Mycamp.findById(req.params.id, function(err, foundCampground ){
		if(err || !foundCampground)
			{
				req.flash("error", "No campground found");
				return res.redirect("back");
			}
		
		Comment.findById(req.params.commentid, function(err, foundComment){
		if(err)
			{
				res.redirect("back");	
			}
		else{
			res.render("./comments/edit", {campground_id : req.params.id, comment : foundComment });
		}
	});
	});
	
	
});

// UPDATE ROUTE FOR COMMENTS
router.put("/:commentid", middleware.checkCommentOwnership, function(req, res){
	
	Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, function(err, comment){
		if(err)
			{
			 return res.redirect("back");	
			}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});

// DELETE THE COMMENTS
router.delete("/:commentid", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndDelete(req.params.commentid, function(err){
		if(err)
			{
				res.redirect("back");
			}
		else{
			req.flash("success", "Comment deleted")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports =router;