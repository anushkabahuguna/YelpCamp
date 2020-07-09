var mongoose = require('mongoose');//database
// each campground has a Schema 
var campSchema = new mongoose.Schema({
	name : String,
	price : String,
	image : String,
	description : String,
	location: String,
	coordinates : Array,
	createdAt :{type : Date, default:Date.now},
	author :
	{
		id :{
			type: mongoose.Schema.Types.ObjectId,
// 		  name of model
        	 ref: "User" 
			
		},
		username : String
		
		
	},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
// 		  name of model
         ref: "Comment" 
		  
      }
   ]
	
});
// PRE HOOK THE MODEL, SO IF WE DELETE CAMPGROUNDS, WE DELETE ALL COMMENTS ON THAT CAMPGROUND
// const Comment = require('../models/comment');
// campSchema.pre('findByIdAndDelete', async function() {
// 	await Comment.remove({
// 		_id: {
// 			$in: this.comments
// 		}
// 	});
// });

//this name is automatically pluralised and made a collection
module.exports = mongoose.model("Mycamp", campSchema);