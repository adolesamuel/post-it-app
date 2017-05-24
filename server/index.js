var express = require("express");
var app = express();
var	bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var	firebase = require("firebase");

var path = require('path');
var port = process.env.PORT || 3555;

//firebase setup==========================
var config ={
	apiKey: "AIzaSyDaZcVz-je_sdDjTLodyhn3ZFYxzAPbpPs",
    authDomain: "testapp-6318a.firebaseapp.com",
    databaseURL: "https://testapp-6318a.firebaseio.com",
    projectId: "testapp-6318a",
    storageBucket: "testapp-6318a.appspot.com",
    messagingSenderId: "845061257899"
};
firebase.initializeApp(config);
var db = firebase.database();
	usersRef = db.ref("Users");
//==============================================


//Body parser to grab requests from signup form post request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());


//This gets route for webpage 
//test of server.===============================
app.use(function(req,res,next){
	console.log("%s request recieved", req.method);
	next()
});

app.get('/', function(req,res){
	res.sendFile(path.join( __dirname + '/index.html'));
	console.log("You have successfully logged in to homepage");
});

//configure to handle CORS request 
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POSTS');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, \
		content-type, Authorization');
	next();
});
//===================================================================


//validate elements of the data are not empty
//check if username or password exist in Database
//create user if no errors exist and push to database.
//delete user if user chooses to be deleted
//==============================================================
var upRoute = express.Router();

upRoute.use( function(req, res, next) {
	console.log("someone just came to the app");
	// this is where we authenticate users
	next();
});

upRoute.route('/user/signup')
	.post( function( req, res){
	//create user object
	var user = {};
		user.email = req.body.mail;
		user.username =req.body.uName;
		user.password = req.body.pWord;
	//validate elements of the signup form are not empty
	req.checkBody('mail', "Account can't be opened without email").notEmpty()
	req.checkBody('uName', "Account can't be opened without name").notEmpty()
	req.checkBody('pWord', "Account can't be opened without password").notEmpty()
	var errors = req.validationErrors();
	if(errors){
		console.log("empty signup fields present in form");
		res.json(errors);
	}
	else{
	// this should log items to firebase
	// check for users with same username or same info before creating.
	console.log(" check has been run");
	usersRef.push({ email : req.body.mail,
			username : req.body.uName,
			password : req.body.pWord,	
		}, 
		function(err){
			if (err){
				console.log("error is present"+err);
			}
			else{
				res.json({ message: "Users have successfully signed up"});
			}
		});
}//
})

	.get(function(req, res) {
		// Firebase get all users
		console.log("Fetched list of all users")
		usersRef.once("value", function(snapshot, prevChildKey) {
			res.json(snapshot.val());
		})
	});


//register the routes after creation.
app.use('/', upRoute);

//This starts the server on port declared as 3555=========================================
app.listen(port);
console.log('APP is running on port:' + port);
