require("dotenv").config();
var express 	 = require("express"),
app     	 	 = express(),
bodyParser 		 = require("body-parser"),
mongoose 		 = require('mongoose'),
flash			 = require("connect-flash"),
passport		 = require("passport"),
localStrategy	 = require("passport-local"),
methodOverride	 = require("method-override"),
Mycamp 			 = require("./models/campgrounds"),
Comment 		 = require("./models/comment"),
User			 = require("./models/user"),
seedDB			 = require("./seeds");
const mapboxgl = require('mapbox-gl');
const axios = require('axios');


const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"),
geocodingClient = mbxGeocoding({accessToken : "pk.eyJ1IjoiYW51c2hrYWJhaHVndW5hIiwiYSI6ImNrY2F0Mmt3ZTF5bGUydG8wb20xcm44ZHoifQ.UtZYdlNq7Na06vmHIQRlaA" });
	 
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes   = require("./routes/index");
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true});
console.log(process.env.DATABASEURL);

// mongoose.connect("mongodb+srv://anushkabahuguna:lDkdTaatgKbLz4eF@cluster0.b2irn.mongodb.net/yelp_camp?retryWrites=true&w=majority", 
// 				 { useNewUrlParser: true,
// 				  useUnifiedTopology: true,
// 				  useCreateIndex : true}).then(() => {
// 	console.log("connected to db");
// }).catch(err =>{
// 	console.log(err.message);
// });



app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static( __dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); 
// seeding db

app.locals.moment = require('moment');
// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret : "This is my secret",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use( new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// REQUIRING ROUTES
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);
 

    app.listen(process.env.PORT || 3000, function () {
      console.log("Server Has Started!");
    });







