const mongoose = require('mongoose'),
	Schema 	   = mongoose.Schema,
	ObjectId   = Schema.Types.ObjectId;
let UserSchema = new Schema({
	email: String,
	facebookid : String,
	password   : String,
	profile_pic: String,
	people_you_are_following : [String],
	followers  : [String],
	username: {
	    type: String,
	    required: true,
	    unique: true,
	},
	articles: {
	    type: ObjectId,
	    ref : 'Article'
	}
})
module.exports = mongoose.model('User',UserSchema);

