var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var userSchema=new mongoose.Schema({
	first: String,
	last: String,
	email: String,
	username: String,
	password: String,
	gender: String,
	status: String,
	institution: String,
	coverPhoto:String,
	profilePhoto:String,
	country: String,
	linkedIn: String,
	codeChef:String,
	codeChef_rating:String,
	codeChef_stars:String,
	codeForces:String,
	codeForces_rating: String,
	codeForces_rank: String,
	hackerRank:String,
	topCoder:String,
	leetCode:String
});
//provides functionality
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);