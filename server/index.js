const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const firebase = require("firebase");

let path = require('path');
let port = process.env.PORT || 3555;

//firebase setup==========================

let config = {
    apiKey: "AIzaSyCD2kvr4bfNGOfdMuaWGb-i6ZU3qMdIPNo",
    authDomain: "post-it-app-e9bab.firebaseapp.com",
    databaseURL: "https://post-it-app-e9bab.firebaseio.com",
    projectId: "post-it-app-e9bab",
    storageBucket: "post-it-app-e9bab.appspot.com",
    messagingSenderId: "689811360579"
  };
  firebase.initializeApp(config);

  let db = firebase.database();
  	usersRef = db.ref('users');
  	groupRef = db.ref('Groups');

//==========================================================


//Body parser to parse requests into req objexts
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//This gets route for webpage 
//test of server.===========================================

app.use((req,res,next) => {
	console.log("%s request recieved", req.method);
	next()
});

app.get('/', (req,res) => {
	res.sendFile(path.join( __dirname + '/index.html'));
	console.log("You have successfully logged in to homepage");
});

//validate elements of the data are not empty
//check if username or password exist in Database
//create user if no errors exist and push to database.
//delete user if user chooses to be deleted
//==============================================================

let upRoute = express.Router();

upRoute.use( (req, res, next) => {
	console.log("User on signup page");
	// this is where we authenticate users
	next();
});

upRoute.route('/user/signup')
	.post( ( req, res) => {
		let email = req.body.mail;
		let	password = req.body.pWord;
		let username = req.body.uName;
		firebase.auth().createUserWithEmailAndPassword(email, password)
	.then((user) => {
		// add element to database
		usersRef.push({
			email : user.email,
			username : username,
			password : password
		});
		console.log("User: "+ user.email+" has signed up");
		res.json({ username: req.body.uName, Password: req.body.pWord, Email : req.body.mail});
	})
	.catch((error) => {
		res.json(error);
	})
})

//===========sign in route created here===========

let inRoute = express.Router();
 inRoute.use((req, res, next) => {
 	console.log("User is on login page");
 	next();
 })
 inRoute.route('/user/signin')
 	.post( (req, res) => {
 		let email = req.body.mail;
 		let password = req.body.pWord;
 		firebase.auth().signInWithEmailAndPassword(email, password)
 		.then((user) =>{
 		console.log("User"+email+" has signed in");
 		// console.log(user);
 		})
 		.catch((error) =>{
 			res.json(error);
 		});
 		
 	});

///=======================Sign out Route=======================

 let outRoute = express.Router();
 	outRoute.route('/user/signout')
 		.post( (req, res) => {
 			firebase.auth().signOut()
 			.then(() => {
 				console.log('User signed out');
 				res.send('user signed out');
 			})
 			.catch((error) => {
 				console.log('Sign out Error')
 				res.send('Sign Out Error');
 			});
 		});

//=======================Group creation route ======================
 // prevent the user from creating multiple groups

	let gRoute = express.Router();
		gRoute.route('/group')
			.post(( req, res) => {
			let email = req.body.mail;
			let password = req.body.pWord;
			let groupName = req.body.groupName;
			firebase.auth().signInWithEmailAndPassword(email, password)
			.then((user) => {
			firebase.auth().onAuthStateChanged((user) => {
			if(user){
			const groupKey = groupRef.push({
			groupname : req.body.groupname,
			Admin: { 1 : req.body.mail},
			groupMembers: [req.body.mail],
			groupMessage:[{ 
				username: req.body.uName,
				message: "I am the first user "}]
		}).key;
			}
			else { 
				res.send('User is not signed in');
			}
		});
		});
			res.send('Group has been created');
		});



///================================add members route===
//to add members I need to access group, groupref.groupmembers.push(user)
	let addRoute = express.Router();
		addRoute.route('/group/<groupKey>/user')
		.post(( req, res) => {

		})






//register the routes after creation.
app.use('/', upRoute);
app.use('/', inRoute);
app.use('/', outRoute);
app.use('/', gRoute);
app.use('/', addRoute);


//This starts the server on port declared as 3555=========================================
app.listen(port);
console.log('APP is running on port:' + port);