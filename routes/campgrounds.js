require("dotenv").config();
var express = require("express");
var router = express.Router({mergeParams : true});
var Mycamp  = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"),
geocodingClient = mbxGeocoding({accessToken : "pk.eyJ1IjoiYW51c2hrYWJhaHVndW5hIiwiYSI6ImNrY2F0Mmt3ZTF5bGUydG8wb20xcm44ZHoifQ.UtZYdlNq7Na06vmHIQRlaA" });

const axios = require('axios');
	 

// ============================
// CAMPGROUND ROUTES
// ============================

// show all routes
// HERE WE WILL CHECK IF THE USER MADE A search(get) REQUEST THROUGH SEARCH FORM OR A GET request to show all campgrounds
router.get("/", function(req, res){
	
	if(req.query.search){
// 		a search request was made
		
		 const regex = new RegExp(escapeRegex(req.query.search), 'gi');
// 	we can search like { "name": regex } this also for searching name only
	Mycamp.find({$or: [{name: regex,}, {location: regex}, {"author.username":regex}]}, function(err, allcamps){
		if(err)
		{
			req.flash("error", "Error in searching, please try again");
			return res.redirect("back");
		}
	else{
			if(allcamps.length < 1)
				{
					req.flash("error", "No search found");
				    return res.redirect("/campgrounds");
					
				}
		else{
			res.render("campgrounds/index", {camp : allcamps});
		}
			
		}
	});
		
	}
	else{
// 		a simple get request(without search) was made
		// 	get all campgrounds from db and render the file
		Mycamp.find({}, function(err, allcamps){
			if(err)
			{
				console.log(err);

			}
		else{
				res.render("campgrounds/index", {camp : allcamps});
			}
		});
		
	}
	


});
// restful routing same url but different types of requests



// CREATE ROUTE
 router.post("/", middleware.isLoggedIn,  function(req, res){
// 	get data from forms and add to our camp object(which will change to database later)
	var author = {
		id : req.user._id,
		username : req.user.username
	};
	 
// async function user2(){
// // 	check this way not working
		 
// 		 let response = await geocodingClient.forwardGeocode(
// 			{
// 			 query: req.body.location,
// 			 limit: 1
// 			})
// 		 .send()
//   .catch(err => {
//    console.log(err);
//   });

	

// 	 	var newcamp = {name : req.body.name,
// 	 	image : req.body.image,
// 	 	description: req.body.description,
// 	 	author : author,
// 	 	price : req.body.price,
// 	 	 coordinates : response.body.features[0].geometry.coordinates
				   
// 	 	}
		
// 			Mycamp.create(newcamp, function(err, camps){
// 		if(err)
// 			{
// 				console.log("error" + err);
// 			}
// 		else{
// 			// 	redirect back to get("/campgrounds")
// 			console.log(newcamp);
// 			res.redirect("/campgrounds");
// 		}
// 	});
	 // console.log(req.body.location);
 // }
 // user2();
	
// 	 ======================================================
 async function getUser() {
  try {
	  
   const response = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + req.body.location + '.json?access_token=' + process.env.MAPBOX_D_TOKEN);
	  
 console.log(process.env.MAPBOX_D_TOKEN);
	  var newcamp = {name : req.body.name,
				   image : req.body.image,
				   description: req.body.description,
				   author : author,
				   price : req.body.price,
					 location : req.body.location,
					coordinates : response.data.features[0].geometry.coordinates
				   
				  }
	  	Mycamp.create(newcamp, function(err, camps){
		if(err)
			{
				console.log("error" + err);
			}
		else{
			// 	redirect back to get("/campgrounds")
			 console.log(newcamp);
			res.redirect("/campgrounds");
		}
	});
	  
  }
	 catch (error)
	 {
    console.error(error);
  	}
}
getUser();

// 	=======================================================================
	
	
});
// NEW COMMENTS ROUTE
router.get("/new", middleware.isLoggedIn,  function(req, res){
	 res.render("campgrounds/new");

});

// shows more info about a particular campground
router.get("/:id", function(req, res){
	// 	find campground with provided provided provided id 
	  Mycamp.findById(req.params.id).populate("comments").exec(function(err, found){
		  if(err || !found)
			  {
				  req.flash("error", "Campground not found");
				  res.redirect("back");
			  }
		  else{
			  res.render("campgrounds/show", {found: found, token :process.env.MAPBOX_D_TOKEN});
			  
			  
		  		}
	  });
// 	render show template displaying the info
});

// EDIT CAMPROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership,  function(req, res){
	Mycamp.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground : foundCampground,});
	});			
	
});
// UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	
	async function getUser() {
  try {
	  
   const response = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + req.body.campground.location + '.json?access_token=pk.eyJ1IjoiYW51c2hrYWJhaHVndW5hIiwiYSI6ImNrY2F0Mmt3ZTF5bGUydG8wb20xcm44ZHoifQ.UtZYdlNq7Na06vmHIQRlaA');
	
	   req.body.campground.coordinates = response.data.features[0].geometry.coordinates;
	 
	  	Mycamp.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
		if(err)
			{
			
				res.redirect("/campgrounds");
			}
		else{
			console.log(updatedCamp);
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	  
  }
	 catch (error)
	 {
    console.error(error);
  	}
}
getUser();

	

	
	
	
	
	
	

});


// DESTROY CAMPGROUND ROUTE
//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	
//find campground to be deleted and delete the comments associated to it
	Mycamp.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//remove all comments associated to this campground
			foundCampground.comments.forEach(function(comment) {
				Comment.findByIdAndRemove(comment._id, function(err){
					if(err){
						console.log(err);
					} else {
						console.log("removed error from deleted campground");
					}
				})
			});
		}
	});
	
	//remove campground 
	Mycamp.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {			
			res.redirect("/campgrounds");
		}
	});
});
function myfunc(x)
{
	return x;
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports =router;