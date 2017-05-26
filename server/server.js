const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');
const path = require('path');

const port = process.env.PORT || 3555;
const app = express();

// firebase setup==================================

const config = {
  apiKey: 'AIzaSyCD2kvr4bfNGOfdMuaWGb-i6ZU3qMdIPNo',
  authDomain: 'post-it-app-e9bab.firebaseapp.com',
  databaseURL: 'https://post-it-app-e9bab.firebaseio.com',
  projectId: 'post-it-app-e9bab',
  storageBucket: 'post-it-app-e9bab.appspot.com',
  messagingSenderId: '689811360579'
};
firebase.initializeApp(config);

const db = firebase.database();
const usersRef = db.ref('users');
const groupRef = db.ref('Groups');

// ================================================


// Body parser to parse requests into req objexts==
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

// create user if no errors exist and push to database.
// ============signUp Route========================

app.route('/user/signup')
  .post((req, res) => {
    const email = req.body.mail;
    const password = req.body.password;
    const username = req.body.userName;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
// add element to database
      usersRef.push({
        email: email,
        username: username,
        password: password
      });
      res.send(`User: ${user.email} has signed up`);
      res.json({ username: req.body.userName,
        Password: req.body.password,
        Email: req.body.mail });
    })
.catch((error) => {
  res.json(error);
});
  });

// ===========sign in route created here===========

app.route('/user/signin')
.post((req, res) => {
  const email = req.body.mail;
  const password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email, password)
.then((user) => {
  res.send(`User${user.email} has signed in`);
})
.catch((error) => {
  res.json(error);
});
});

// ==========Sign out Route===============

app.route('/user/signout')
.post((req, res) => {
  firebase.auth().signOut()
.then(() => {
  res.send('user signed out');
})
.catch((error) => {
  res.json(error);
});
});

// =============Group creation route =======
// prevent the user from creating multiple groups

app.route('/group')
.post((req, res) => {
  const email = req.body.mail;
  const password = req.body.password;
  const groupName = req.body.groupName;
  firebase.auth().signInWithEmailAndPassword(email, password)
.then((user) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      groupRef.push({
        groupname: groupName,
        Admin: email,
        groupMembers: { user: req.body.mail },
        groupMessage: { username: req.body.userName,
          message: 'I am the first user ' } });
    } else {
      res.send(`${user.email} User is not signed in`);
    }
  });
});
  res.send('Group has been created');
});

// ====add user route===========
app.route('/group/:groupId/user')
.post((req, res) => {
  const groupKey = req.params.groupId;
  firebase.database().ref(`Groups/${groupKey}/groupMembers/`)
  .push({ user: req.body.mail });
  res.send('user added');
});

// ======add message route======
app.route('/group/:groupId/message')
.post((req, res) => {
  const groupKey = req.params.groupId;
  firebase.database().ref(`Groups/${groupKey}/groupMessage/`)
  .push({ user: req.body.mail, message: req.body.message });
  res.send('message sent');
});
// This starts the server on port 3555=======
app.listen(port);
